<#
  Deploys the backend to AWS Lambda with a public Function URL.
  Safe to re-run: creates resources on the first run, updates code/config afterwards.

  Usage (from the backend folder):
    powershell -ExecutionPolicy Bypass -File .\deploy-lambda.ps1
    powershell -ExecutionPolicy Bypass -File .\deploy-lambda.ps1 -Profile myprofile

  Environment variables are read from .env. Lambda-reserved keys (AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY, AWS_REGION, ...) and PORT are skipped: on Lambda the S3
  credentials come from the execution role instead.
#>
param(
  [string]$FunctionName = "imgalleri-backend",
  [string]$Region = "eu-north-1",
  [string]$Profile = ""
)

$ErrorActionPreference = "Stop"
$backend = $PSScriptRoot
$common = @("--region", $Region)
if ($Profile) { $common += @("--profile", $Profile) }

function Invoke-Aws {
  $out = & aws @args @common
  if ($LASTEXITCODE -ne 0) { throw "aws $($args[0]) $($args[1]) failed (exit $LASTEXITCODE)" }
  return $out
}

function Test-Aws {
  $ErrorActionPreference = "Continue"
  & aws @args @common 2>&1 | Out-Null
  return ($LASTEXITCODE -eq 0)
}

function Write-JsonFile([string]$path, $object) {
  $json = $object | ConvertTo-Json -Depth 10
  [IO.File]::WriteAllText($path, $json, (New-Object Text.UTF8Encoding $false))
}

$work = Join-Path $env:TEMP "imgalleri-lambda"
$build = Join-Path $work "build"
$zip = Join-Path $work "function.zip"
$envFile = Join-Path $work "env.json"
Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory $build -Force | Out-Null

try {
  # --- Environment variables from .env -------------------------------------
  $reserved = @("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN",
                "AWS_REGION", "AWS_DEFAULT_REGION", "PORT")
  $vars = [ordered]@{}
  foreach ($line in Get-Content (Join-Path $backend ".env")) {
    if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
      $key = $Matches[1]; $value = $Matches[2].Trim()
      if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") { $value = $Matches[1] }
      if ($reserved -notcontains $key) { $vars[$key] = $value }
    }
  }
  $vars["NODE_ENV"] = "production"
  foreach ($required in @("MONGO_URI", "SECRET", "CORS_ORIGINS", "AWS_BUCKET_NAME")) {
    if (-not $vars[$required]) { throw "$required missing from .env" }
  }
  $bucket = $vars["AWS_BUCKET_NAME"]
  Write-JsonFile $envFile @{ Variables = $vars }
  Write-Host "Environment variables: $($vars.Keys -join ', ')"

  # --- Build deployment package --------------------------------------------
  Write-Host "Building package..."
  $items = @("app.js", "lambda.js", "package.json", "package-lock.json",
             "config", "controllers", "middleware", "models", "routers", "utils")
  foreach ($item in $items) { Copy-Item (Join-Path $backend $item) $build -Recurse }
  Push-Location $build
  try {
    & npm ci --omit=dev --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed" }
  } finally { Pop-Location }
  & "$env:SystemRoot\System32\tar.exe" -a -c -f $zip -C $build @items node_modules
  if ($LASTEXITCODE -ne 0) { throw "zip failed" }
  Write-Host ("Package size: {0:N1} MB" -f ((Get-Item $zip).Length / 1MB))

  # --- IAM execution role --------------------------------------------------
  $roleName = "$FunctionName-role"
  $newRole = $false
  if (-not (Test-Aws iam get-role --role-name $roleName)) {
    Write-Host "Creating IAM role $roleName..."
    $trust = Join-Path $work "trust.json"
    Write-JsonFile $trust @{
      Version = "2012-10-17"
      Statement = @(@{ Effect = "Allow"; Principal = @{ Service = "lambda.amazonaws.com" }; Action = "sts:AssumeRole" })
    }
    Invoke-Aws iam create-role --role-name $roleName --assume-role-policy-document "file://$trust" | Out-Null
    Invoke-Aws iam attach-role-policy --role-name $roleName `
      --policy-arn "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole" | Out-Null
    $newRole = $true
  }
  $s3Policy = Join-Path $work "s3policy.json"
  Write-JsonFile $s3Policy @{
    Version = "2012-10-17"
    Statement = @(@{
      Effect = "Allow"
      Action = @("s3:GetObject", "s3:PutObject", "s3:DeleteObject")
      Resource = "arn:aws:s3:::$bucket/*"
    })
  }
  Invoke-Aws iam put-role-policy --role-name $roleName --policy-name "s3-media-bucket" `
    --policy-document "file://$s3Policy" | Out-Null
  $roleArn = Invoke-Aws iam get-role --role-name $roleName --query "Role.Arn" --output text

  # --- Lambda function -----------------------------------------------------
  $config = @("--timeout", "15", "--memory-size", "512", "--environment", "file://$envFile")
  if (Test-Aws lambda get-function --function-name $FunctionName) {
    Write-Host "Updating function $FunctionName..."
    Invoke-Aws lambda update-function-code --function-name $FunctionName --zip-file "fileb://$zip" | Out-Null
    Invoke-Aws lambda wait function-updated-v2 --function-name $FunctionName
    Invoke-Aws lambda update-function-configuration --function-name $FunctionName @config | Out-Null
    Invoke-Aws lambda wait function-updated-v2 --function-name $FunctionName
  } else {
    Write-Host "Creating function $FunctionName..."
    if ($newRole) { Start-Sleep -Seconds 10 }  # new IAM roles take a moment to propagate
    $created = $false
    for ($i = 1; $i -le 5 -and -not $created; $i++) {
      $created = Test-Aws lambda create-function --function-name $FunctionName `
        --runtime nodejs22.x --architectures arm64 --handler lambda.handler `
        --role $roleArn --zip-file "fileb://$zip" @config
      if (-not $created) { Start-Sleep -Seconds 5 }
    }
    if (-not $created) {
      # Run once more without swallowing output so the error is visible.
      Invoke-Aws lambda create-function --function-name $FunctionName `
        --runtime nodejs22.x --architectures arm64 --handler lambda.handler `
        --role $roleArn --zip-file "fileb://$zip" @config | Out-Null
    }
    Invoke-Aws lambda wait function-active-v2 --function-name $FunctionName
  }

  # --- Public Function URL (CORS is handled by Express) --------------------
  if (-not (Test-Aws lambda get-function-url-config --function-name $FunctionName)) {
    Write-Host "Creating Function URL..."
    Invoke-Aws lambda create-function-url-config --function-name $FunctionName --auth-type NONE | Out-Null
    Invoke-Aws lambda add-permission --function-name $FunctionName `
      --statement-id FunctionURLAllowPublicAccess --action lambda:InvokeFunctionUrl `
      --principal "*" --function-url-auth-type NONE | Out-Null
    Invoke-Aws lambda add-permission --function-name $FunctionName `
      --statement-id FunctionURLAllowInvokeAction --action lambda:InvokeFunction `
      --principal "*" --invoked-via-function-url | Out-Null
  }
  $url = Invoke-Aws lambda get-function-url-config --function-name $FunctionName --query "FunctionUrl" --output text

  Write-Host ""
  Write-Host "Deployed. Function URL: $url"
  Write-Host "Set the frontend's REACT_APP_API_URL to this URL without the trailing slash."
} finally {
  # env.json contains secrets; never leave it behind.
  Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue
}

import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import '../css/login.css';
import '../css/legal.css';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = useField("username");
  const password = useField("password");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");

  const API_BASE = process.env.REACT_APP_API_URL;

  const { login, error } = useLogin(`${API_BASE}/api/users/login`);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      setTermsError("You must accept the Privacy Policy and Terms of Service to continue.");
      return;
    }
    
    setTermsError("");
    await login({ username: username.value, password: password.value });
    if (!error && localStorage.getItem("token")) {
      setIsAuthenticated(true);
      navigate("/");
    }
    else {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <div className="brand-section">
      <img className="logo" src="/images/photo-gallery.png" alt="logo" />
        <h1>imGalleri</h1>
        <p>
        Welcome to imGalleri! Your journey in pixels starts here. Capture life’s essence and share your creativity.
        </p>
      </div>
      <div className="login-section">
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="username"
            name="username"
            required=""
            {...username}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            required=""
            {...password}
          />
          
          <div className="legal-acceptance">
            <input 
              type="checkbox" 
              id="acceptTerms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <label htmlFor="acceptTerms">
              I agree to the{" "}
              <Link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </Link>
              {" "}and{" "}
              <Link to="/terms-of-service" target="_blank" rel="noopener noreferrer">
                Terms of Service
              </Link>
            </label>
          </div>
          {termsError && <div className="legal-error">{termsError}</div>}
          
          <button type="submit">Login</button>
          
          <div className="form-footer">
            <p>Don’t have an account?</p>
            <Link to="/signup">Sign up</Link>
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </form>
        {error && (
        <div className={`error ${error ? 'show' : ''}`}>
          <div>{error}!</div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Login;
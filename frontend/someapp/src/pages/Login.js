import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../css/login.css';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = useField("username");
  const password = useField("password");

  const API_BASE = process.env.REACT_APP_API_URL;

  const { login, error } = useLogin(`${API_BASE}/api/users/login`);

  const handleLogin = async (e) => {
    e.preventDefault();
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
          <button type="submit">Login</button>
          <div className="form-footer">
            <p>Don’t have an account?</p>
            <Link to="/signup">Sign up</Link>
            <a href="/forgot-password">Forgot your password?</a>
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
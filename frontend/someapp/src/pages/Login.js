import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import logo from './photo-gallery.png';
import { Link } from "react-router-dom";
import '../css/login.css';


const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const email = useField("email");
  const password = useField("password");

  const { login, error } = useLogin("http://localhost:3001/api/users/login");

  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ email: email.value, password: password.value });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };
  return (
    <div className="containerj">
      <div className="brand-section">
      <img className="logo" src={logo} alt="logo" />
        <h1>imGalleri</h1>
        <p>
        Welcome to imGalleri! Your journey in pixels starts here. Capture life’s essence and share your creativity.
        </p>
      </div>
      <div className="login-section">
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="email"
            name="email"
            required=""
            {...email}
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
            <a href="/">Forgot your password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
  /*return (
    <div className="icon"> 
      <img src={logo} alt="logo" />
      <form className="login" onSubmit={handleFormSubmit}>
        <h3>Login</h3>
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        <button>Login</button>
      </form>
    </div>
  );
};*/

export default Login;
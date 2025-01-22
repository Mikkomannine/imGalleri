import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import logo from './photo-gallery.png';
import { Link } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = useField("username");
  const email = useField("email");
  const password = useField("password");
  const phoneNumber = useField("phone");
  const firstName = useField("firstName");
  const lastName = useField("lastName");

  const { signup, error } = useSignup("http://localhost:3001/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({ username: username.value, email: email.value, password: password.value, firstName: firstName.value, lastName: lastName.value, phoneNumber: phoneNumber.value});
    if (!error && localStorage.getItem("token")) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
    else {
      console.log(error);
  };
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
            <form onSubmit={handleFormSubmit} className="login-form">
              <input
                type="text"
                placeholder="username"
                name="username"
                required=""
                {...username}
              />
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
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                required=""
                {...firstName}
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                required=""
                {...lastName}
              />
              <input
                type="text"
                placeholder="Phone Number"
                name="phoneNumber"
                required=""
                {...phoneNumber}
              />
              <button type="submit">Sign Up</button>
              <div className="form-footer">
                <p>Already have an account?</p>
                <Link to="/login">Log In</Link>
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

export default Signup;

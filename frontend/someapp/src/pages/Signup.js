import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useState } from "react";
import '../css/legal.css';

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const username = useField("username");
  const email = useField("email");
  const password = useField("password");
  const phoneNumber = useField("phone");
  const firstName = useField("firstName");
  const lastName = useField("lastName");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const API_BASE = process.env.REACT_APP_API_URL;

  const { signup, error } = useSignup(`${API_BASE}/api/users/signup`);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user has accepted terms
    if (!acceptedTerms) {
      setTermsError("You must accept the Privacy Policy and Terms of Service to create an account.");
      return;
    }
    
    setTermsError(""); // Clear any previous error
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
    <div className="container">
          <div className="brand-section">
          <img className="logo" src="/images/photo-gallery.png" alt="logo" />
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
              
              <div className="legal-acceptance">
                <input 
                  type="checkbox" 
                  id="acceptTermsSignup"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <label htmlFor="acceptTermsSignup">
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

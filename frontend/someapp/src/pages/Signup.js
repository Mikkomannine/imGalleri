import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const email = useField("email");
  const password = useField("password");
  const role = useField("role");
  const phoneNumber = useField("phone");
  const firstName = useField("firstName");
  const lastName = useField("lastName");

  const { signup, error } = useSignup("http://localhost:3001/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({ email: email.value, password: password.value, firstName: firstName.value, lastName: lastName.value, role: role.value, phoneNumber: phoneNumber.value});
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <>
      <form className="signup" onSubmit={handleFormSubmit}>
        <h3>Sign Up</h3>
        <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        <label>First Name:</label>
        <input {...firstName} />
        <label>Last Name:</label>
        <input {...lastName} />
        <label>Role:</label>
        <input {...role} />
        <label>Phone Number:</label>
        <input {...phoneNumber} />
        <button>Sign up</button>
      </form>
    </>
  );
};

export default Signup;

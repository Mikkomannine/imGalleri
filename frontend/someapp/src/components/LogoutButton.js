import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };
    return (
        <div>
            <button className="logout-button" onClick={handleLogout}>Log Out</button>
        </div>
    );
};

export default LogoutButton;

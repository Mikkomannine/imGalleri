import { useNavigate } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import '../css/layoyt.css';
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { SearchResultsList } from "./searchResultList";
import logo from '../pages/photo-gallery.png';
import { useEffect, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Layout = () => {
    const [results, setResults] = useState([]);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const navRef = useRef();

    const navigate = useNavigate();

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    useEffect(() => {
        if (isNavOpen) {
            navRef.current.classList.add('responsive-nav');
        } else {
            navRef.current.classList.remove('responsive-nav');
        }
    }, [isNavOpen]);

    const Logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
       // setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <div className="nav-bar">
            <nav ref={navRef}>
                <ul>
                <li className="logoMain">
                    <Link to="/" onClick={toggleNav}>
                        <img className="web-project-logo" src={logo} alt="logo" />
                    </Link>
                </li>
                <li>
                    <SearchBar setResults={setResults} />
                    <SearchResultsList results={results} />
                </li>
                <li className="link">
                    <Link to="/" onClick={toggleNav}>Home</Link>
                </li>
                <li className="link">
                    <Link to="/following" onClick={toggleNav}>Following</Link>
                </li>
                <li className="link">
                    <Link to="/myprofile" onClick={toggleNav}>MyProfile</Link>
                </li>
                <li>
                    <div className="text-wrapper-3"><button onClick={Logout}>Log Out</button></div>
                </li>
                <button className="nav-btn nav-close-btn"
					onClick={toggleNav}>
					<FaTimes />
                </button>
                </ul>
            </nav>
            <button
                    className="nav-btn"
                    onClick={toggleNav}>
                    <FaBars/>
            </button>
            <Outlet />
        </div>
    );
    }

export default Layout;
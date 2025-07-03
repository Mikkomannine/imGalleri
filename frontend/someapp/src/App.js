import MyProfile from './pages/myProfile';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import PropTypes from 'prop-types';

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostForm from './pages/postform';
import ProfilePage from './pages/profile';
import Home from './pages/home';
import Post from './pages/post';
import EditProfilePage from './pages/EditProfilePage';
import Layout from './components/layout';
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/ResetPassword';
import Following from './pages/Following';


function RoutesComponent({ setIsAuthenticated, isAuthenticated }) {
  const location = useLocation();
  const showLayout = !['/login', '/signup'].includes(location.pathname);

  const routes = [
    { path: "/", element: <Home /> },
    { path: "/myprofile", element: <MyProfile /> },
    { path: "/postform", element: <PostForm /> },
    { path: "/post/:id", element: <Post /> },
    { path: "/profile/:id", element: <ProfilePage /> },
    { path: "/edit/profile/:id", element: <EditProfilePage /> },
    { path: "/login", element: <Login setIsAuthenticated={setIsAuthenticated} />, isAuthenticated: false },
    { path: "/signup", element: <Signup setIsAuthenticated={setIsAuthenticated} />, isAuthenticated: false },
    { path: "/forgot-password", element: <ForgotPassword />, isAuthenticated: false },
    { path: "/reset-password/:token", element: <ResetPassword />, isAuthenticated: false },
    { path: "/following", element: <Following/> },

  ];

  return (
    <>
      {showLayout && <Layout />}
      <Routes>
        {routes.map(({ path, element, isAuthenticated: routeIsAuthenticated }) => (
          <Route
            key={path}
            path={path}
            element={
              isAuthenticated || routeIsAuthenticated === false
                ? element
                : <Navigate to="/login" />
            }
          />
        ))}
      </Routes>
    </>
  );
}

RoutesComponent.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("token")));

  return (
    <div className="App">
      <BrowserRouter>
          <RoutesComponent setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} />
      </BrowserRouter>
    </div>
  );
}

export default App;
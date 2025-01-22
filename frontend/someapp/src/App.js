import React from 'react';
import './css/App.css';
import MyProfile from './pages/myProfile'; // Import the myprofile
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// pages & components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostForm from './pages/postform';
import UpdatePost from './pages/updatePost';
import ProfilePage from './pages/profile';
import Home from './pages/home';
import Post from './pages/post';
import EditProfilePage from './pages/EditProfilePage';
import Layout from './components/layout';
import { useLocation } from 'react-router-dom';


function RoutesComponent({ setIsAuthenticated, isAuthenticated }) {
  const location = useLocation(); // Now useLocation is used within the context of <BrowserRouter>
  const showLayout = !['/login', '/signup'].includes(location.pathname);

  const routes = [
    { path: "/", element: <Home /> },
    { path: "/myprofile", element: <MyProfile /> },
    { path: "/postform", element: <PostForm /> },
    { path: "/post/:id", element: <Post /> },
    { path: "/:id/update", element: <UpdatePost /> },
    { path: "post/profile/:id", element: <ProfilePage /> },
    { path: "/edit/profile/:id", element: <EditProfilePage /> },
    { path: "/login", element: <Login setIsAuthenticated={setIsAuthenticated} />, isAuthenticated: false },
    { path: "/signup", element: <Signup setIsAuthenticated={setIsAuthenticated} />, isAuthenticated: false },
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
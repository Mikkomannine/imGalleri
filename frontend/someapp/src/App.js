import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from './pages/forgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/home';
import MyProfile from './pages/myProfile';
import PostForm from './pages/postform';
import Post from './pages/post';
import ProfilePage from './pages/profile';
import EditProfilePage from './pages/EditProfilePage';
import Following from './pages/Following';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Layout
import Layout from './components/layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem("token")));

  return (
    <div className="App">
      <HashRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* Protected routes wrapped in Layout */}
          <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/" element={<Home />} />
            <Route path="/myprofile" element={<MyProfile />} />
            <Route path="/postform" element={<PostForm />} />
            <Route path="/post/:id" element={<Post />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/edit/profile/:id" element={<EditProfilePage />} />
            <Route path="/following" element={<Following />} />
          </Route>

          {/* Catch-all for invalid paths */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

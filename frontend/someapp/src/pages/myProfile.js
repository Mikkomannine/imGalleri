import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostDetails from '../components/postDetails';
import '../css/profile.css';
import image from './user.png';
import logo from './photo-gallery.png';


const MyProfile = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [postArray, setPostArray] = useState([])
  const [followers, setFollowers] = useState([]);
  const [update , setUpdate] = useState(false);

  useEffect(() => {
    const fetchMyprofile = async () => {
        const token = localStorage.getItem('token');
      const config = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };
      try {
        const res = await fetch(`http://localhost:3001/api/users/myprofile`, config);
        if (!res.ok) {
          throw new Error("Failed to fetch image");
        }
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setImageUrl(data.user.imageUrl);
          setFollowers(data.user.followers);
        } else {
          console.warn("No image URL found in response");
        }
      } catch (error) {
        console.error("Error fetching image", error);
      }
    };
    fetchMyprofile();
  }, [update]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const getFollowers = async () => {
      const response = await fetch("http://localhost:3001/api/users/followers/" + user._id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("errorrrr");
        setFollowers([]);
        return;
      }
      console.log("followers was first", data);
      setFollowers(data);
    };
    getFollowers();
  }, [user]);


  
  useEffect(() => {
    if (user && user._id) {
    const getPost = async () => {
      const response = await fetch("/api/media/user/" + user._id , {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("errorrrr");
        setPostArray([]);
        return;
      }
      setPostArray(data);
    };
    getPost();
  }
  }, [user]);

if (!user) return <div className='loading'><img src={logo}></img><p>Loading...</p></div>;

return (
  <div className='profile'>
    <div className='header'>
      <div className='profilepicture'>
      {imageUrl ? (
         <img src={imageUrl} alt="Uploaded" />
        ) : (
          <img src={image} alt="Default" />
        )}
        <div className='bio'>
        <div className='bio-buttons'>
          <Link to={`/edit/profile/${user?._id}`}>
            <button className='edit-button'>Edit Profile</button>
          </Link>
          <Link to="/postform">
         <button className='bio-button'>+</button>
        </Link>
        </div>
        <h2>{user?.username}</h2>
        <div className='bio-text'>
          <p>{user?.bio}</p>
          </div>
        </div>
      </div>
      <div className='followerlist'>
          <h2>Followers {followers.length}</h2>
          <ul>
            {followers.map((follower) => (
              <li key={follower._id}>{follower.username}</li>
            ))}
          </ul>
          </div>
      </div>
      <div className="posts">
        {postArray.length === 0 && <h2>No Posts Found</h2>}
        {postArray.map((postArray) => (
          <PostDetails key={postArray._id} post={postArray} />
        ))}
      </div>
  </div>
);
};

export default MyProfile;


/*
      StrongPassword123!
      */

    

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostDetails from '../components/postDetails';
import '../css/profile.css';


const MyProfile = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [postArray, setPostArray] = useState([])
  const [followers, setFollowers] = useState([]);
  const [update , setUpdate] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

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
      const response = await fetch("http://localhost:3001/api/media/user/" + user._id , {
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.patch(`http://localhost:3001/api/users/upload/` + user._id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data);
      if (response.data) {
        alert('Image uploaded successfully');
        console.log("image uploaded!", response.data);
        setUpdate(true);
      } else {
        console.warn("No image URL found in upload response");
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
  };


return (
  <div className='profile'>
      <div className='bio'>
      <div className='profilepicture'>
      {imageUrl ? (
         <img src={imageUrl} alt="Uploaded" />
        ) : (
         <p>No image found. Please upload an image.</p>
        )}
        <form className='bio-buttons' onSubmit={handleSubmit}>
         <input className='bio-button' type="file" onChange={handleFileChange} />
         <button className='bio-button' type="submit">Upload Image</button>
         <Link to="/postform">
      <button className='bio-button'>+</button>
    </Link>
       </form>
    </div>
          <div className='wrapper'>
              <h2>{user?.email}</h2>
              <div className='follow-wrap'>
              <h2>Followers: {followers.length}</h2>
              <button className='dropdown' onClick={() => setShowFollowers(!showFollowers)}>v</button> {/* Button to toggle followers list */}
              </div>
              {showFollowers && (
                  <>
                      <ul className='followerlist'>
                          <h2>Followers:</h2>
                          {followers.map(follower => (
                              <li key={follower._id}>{follower.email}</li> // Assuming the follower object has an _id and email
                          ))}
                      </ul>
                  </>
              )}
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


/*    <div className="post">
        {postArray.length === 0 && <h2>No Fruit Found</h2>}
        {postArray.map((post) => (
          <PostDetails key={user._id} post={post} />
        ))}
      </div>
      */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PostDetails from '../components/postDetails';
import '../css/profile.css';
import image from './user.png';
import logo from './photo-gallery.png';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import FollowersList from '../components/followerList';
import FollowingList from '../components/FollowingList';

const MyProfile = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [postArray, setPostArray] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [update, setUpdate] = useState(false);
  const shareUrl = window.location.href;

  // Fetch user profile data
  useEffect(() => {
    const fetchMyProfile = async () => {
      const token = localStorage.getItem('token');
      const config = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const res = await fetch(`http://localhost:3001/api/users/myprofile`, config);
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setImageUrl(data.user.imageUrl);
          setFollowers(data.user.followers);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchMyProfile();
  }, [update]);

    useEffect(() => {
    if (!user) {
      return;
    }
    const getFollowers = async () => {
      const response = await fetch("/api/users/followers/" + user._id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("error fetching followers");
        setFollowers([]);
        return;
      }
      console.log("followers was first", data);
      setFollowers(data);
    };
    getFollowers();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const getFollowing = async () => {
      const response = await fetch("/api/users/following/" + user._id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log("error fetching following");
        setFollowing([]);
        return;
      }
      console.log("following was first", data);
      setFollowing(data);
    };
    getFollowing();
  }, [user]);


  // Fetch posts for the user
  useEffect(() => {
    if (user && user._id) {
      const getPosts = async () => {
        const response = await fetch(`/api/media/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        if (!response.ok) {
          console.error('Error fetching posts');
          setPostArray([]);
          return;
        }
        setPostArray(data);
      };
      getPosts();
    }
  }, [user]);



  // Handle like/unlike functionality
  const handleLikeChange = async (postId) => {
    try {
      const response = await fetch(`/api/media/like/${postId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like/unlike the post');
      }

      // Update the postArray to reflect the like/unlike change
      setPostArray((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: post.likes.includes(user._id) ? post.likes.filter((id) => id !== user._id) : [...post.likes, user._id] }
            : post
        )
      );
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  const handleDeletePost = async (mediaId) => {
    try {
      console.log('Deleting post with ID:', mediaId);
      const response = await fetch(`/api/media/delete/${mediaId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      // Remove the deleted post from the UI
      setPostArray((prevPosts) => prevPosts.filter((post) => post._id !== mediaId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (!user) return <div className="loading"><img src={logo} alt="Loading..." /><p>Loading...</p></div>;

  return (
    <div className="profile">
      <div className="header">
        <div className="profilepicture">
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded" />
          ) : (
            <img src={image} alt="Default" />
          )}
          <div className="bio">
            <div className="bio-buttons">
              <Link to={`/edit/profile/${user?._id}`}>
                <button className="edit-button">Edit Profile</button>
              </Link>
              <Link to="/postform">
                <button className="bio-button">+</button>
              </Link>
            </div>
            <h2>{user?.username}</h2>
            <div className="bio-text">
              <p>{user?.bio}</p>
            </div>
          </div>
        </div>
        <div className="wrapper">
        <div className="followerFollowing">
          <FollowersList followers={followers} />
          <FollowingList following={following} />
      </div>
      <div className="sharelinks">
              <button>Share:</button>
              <FacebookShareButton url={shareUrl} title={`Check out ${user?.username}'s profile!`}>
                <img src="./images/facebook.png" alt="Facebook" />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={`Check out ${user?.username}'s profile!`}>
                <img src="./images/twitter.png" alt="Twitter" />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} title={`Check out ${user?.username}'s profile!`}>
                <img src="./images/linkedin.png" alt="Linkedin" />
              </LinkedinShareButton>
            </div>
          </div>
      </div>
      <div className="posts">
        {postArray.length === 0 && <h2>No Posts Found</h2>}
        {postArray.map((post) => (
          <div key={post._id} className="post-wrapper">
            <PostDetails
              post={post}
              isLiked={post.likes.includes(user._id)}
              likes={post.likes}
              userId={user._id}
              username={user.username}
              shareUrl={shareUrl}
              handleLikeChange={() => handleLikeChange(post._id)}
            />
            <button
              className="delete-post-btn"
              onClick={() => handleDeletePost(post._id)}
              style={{ marginTop: '10px', background: '#e74c3c', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProfile;
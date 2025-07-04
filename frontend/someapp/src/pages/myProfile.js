import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostDetails from '../components/postDetails';
import '../css/profile.css';
import ShareLinks from '../components/ShareLinks';
import FollowersList from '../components/followerList';
import FollowingList from '../components/FollowingList';


const MyProfile = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [user, setUser] = useState(null);
  const [postArray, setPostArray] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [update, setUpdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPost, setEditPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const shareUrl = window.location.href;
  const API_BASE = process.env.REACT_APP_API_URL;

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
        const res = await fetch(`${API_BASE}/api/users/myprofile`, config);
        if (res.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
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
      const response = await fetch(`${API_BASE}/api/users/followers/` + user._id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        console.log("error fetching followers");
        setFollowers([]);
        return;
      }
      setFollowers(data);
    };
    getFollowers();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const getFollowing = async () => {
      const response = await fetch(`${API_BASE}/api/users/following/` + user._id, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        console.log("error fetching following");
        setFollowing([]);
        return;
      }
      setFollowing(data);
    };
    getFollowing();
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      const getPosts = async () => {
        const response = await fetch(`${API_BASE}/api/media/user/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
          return;
        }
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

  const handleLikeChange = async (postId) => {
    try {
      const response = await fetch(`${API_BASE}/api/media/like/${postId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like/unlike the post');
      }

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
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    if (!mediaId) {
      console.error('No media ID provided for deletion');
      return;
    }
    try {
      const response = await fetch(`${API_BASE}/api/media/delete/${mediaId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      setPostArray((prevPosts) => prevPosts.filter((post) => post._id !== mediaId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openEditModal = (post) => {
  setEditPost(post);
  setEditTitle(post.title);
  setEditDescription(post.description);
  setShowEditModal(true);
};

const handleEditSubmit = async (e) => {
  e.preventDefault();
  
  const charLimit = 500;
  if (editDescription.length > charLimit) {
    alert(`Your description exceeds the ${charLimit} character limit. Please shorten it.`);
    return; 
  }
  const titleLimit = 20; 
  if (editTitle.length > titleLimit) {
    alert(`Your title exceeds the ${titleLimit} character limit. Please shorten it.`);
    return;
  }
  try {
    const response = await fetch(`${API_BASE}/api/media/update/${editPost._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
    });
    if (!response.ok) throw new Error('Failed to update post');

    setPostArray((prevPosts) =>
      prevPosts.map((post) =>
        post._id === editPost._id
          ? { ...post, title: editTitle, description: editDescription }
          : post
      )
    );
    setShowEditModal(false);
    setEditPost(null);
  } catch (error) {
    console.error('Error updating post:', error);
  }
};

  if (!user) return <div className="loading"><img src="/images/photo-gallery.png" alt="Loading..." /><p>Loading...</p></div>;

  return (
    <div className="profile">
      <div className="header">
        <div className="profilepicture">
          {imageUrl ? (
            <img src={imageUrl} alt="Uploaded" />
          ) : (
            <img src="images/user.png" alt="Default" />
          )}
          <div className="bio">
            <div className="bio-buttons">
              <Link to={`/edit/profile/${user?._id}`}>
                <button className="edit-button">Edit</button>
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
          <ShareLinks shareUrl={shareUrl} username={user.username} />
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
            <div className="buttons">
              <button
                className="btn"
                onClick={() => openEditModal(post)}
                style={{ marginRight: '8px' }}>
                <img src="/images/edit-button.png" alt="Edit" className="edit-icon" />
              </button>
              <button
                className="btn"
                onClick={() => handleDeletePost(post._id)}>
                <img src="/images/bin.png" alt="Delete" className="delete-icon" />
              </button>
              </div>
            </div>
        ))}
      </div>
      {showEditModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Edit Post</h2>
      <form onSubmit={handleEditSubmit}>
        <label>
          <p>Title:</p>
          <textarea className='desc'
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        </label>
        <label>
          <p>Description:</p>
          <textarea className='desc'
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </label>
        <div className="buttons">
          <button type="submit" className="edit-button">Save</button>
          <button className="cancel-button" onClick={() => setShowEditModal(false)}>Cancel</button>
          </div>
        </form>
    </div>
  </div>
)}
    </div>
  );
};

export default MyProfile;
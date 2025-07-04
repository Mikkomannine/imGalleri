import { useEffect, useState } from 'react';
import PostDetails from '../components/postDetails';
import FollowingList from '../components/FollowingList';



const FollowingPage = () => {
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [following, setFollowing] = useState([]);
    const API_BASE = process.env.REACT_APP_API_URL;
    
    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/users/myprofile`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            const data = await response.json();
            setCurrentUserId(data.user._id);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

const getFollowing = async () => {
      const response = await fetch(`${API_BASE}/api/users/following/` + currentUserId, {
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
      

    const fetchFollowingPosts = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/media/following/medias`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

useEffect(() => {
    fetchCurrentUser();
}, []);

useEffect(() => {
    if (currentUserId) {
        getFollowing();
        fetchFollowingPosts();
    }
}, [currentUserId]);

    const handleLikeChange = async (postId) => {
        try {
            const response = await fetch(`${API_BASE}/api/media/like/${postId}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to like/unlike the post');
            }
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? { ...post, likes: post.likes.includes(currentUserId) ? post.likes.filter((id) => id !== currentUserId) : [...post.likes, currentUserId] }
                        : post
                )
            );
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    if (!currentUserId) return <div className='loading'><img src="/images/photo-gallery.png"></img><p>Loading...</p></div>;

    return (
        <div className="home">
            <div>
                <FollowingList following={following} />
            </div>
            <div className="home-posts">
                {posts.map((post) => (
                    <PostDetails
                        key={post._id}
                        post={post}
                        isLiked={post.likes.includes(currentUserId)}
                        likes={post.likes}
                        userId={post.user_id}
                        shareUrl className={`${window.location.origin}/post/${post._id}`}
                        handleLikeChange={() => handleLikeChange(post._id)}
                    />
                ))}
            </div>
        </div>
    );
}
export default FollowingPage;
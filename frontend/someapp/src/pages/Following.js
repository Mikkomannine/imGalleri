
import { useEffect, useState } from 'react';
import PostDetails from '../components/postDetails';
import logo from './photo-gallery.png';
import FollowingList from '../components/FollowingList';

const FollowingPage = () => {
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [following, setFollowing] = useState([]);
    const [user, setUser] = useState(null);

    // Fetch the current user's ID
    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/myprofile`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            setUser(data.user);
            setCurrentUserId(data.user._id);
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

const getFollowing = async () => {
      const response = await fetch("/api/users/following/" + currentUserId, {
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
      

    // Fetch posts by users the current user follows
    const fetchFollowingPosts = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/media/following/medias`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchCurrentUser();
        fetchFollowingPosts();
        getFollowing();
    }, []);

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

            // Update the posts state to reflect the like/unlike change
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

    return (
        <div className="following-page">
            <div className="posts">
                {posts.length === 0 && <div className='loading'><img src={logo}></img><p>Loading...</p></div>}
                {posts.map((post) => (
                    <PostDetails
                        key={post._id}
                        post={post}
                        isLiked={post.likes.includes(currentUserId)}
                        likes={post.likes}
                        userId={post.user_id}
                        username={post.username}
                        shareUrl={`${window.location.origin}/post/${post._id}`}
                        handleLikeChange={() => handleLikeChange(post._id)}
                    />
                ))}
            </div>
            <div className="followerFollowing">
                <FollowingList following={following} />
            </div>
        </div>
    );
}
export default FollowingPage;
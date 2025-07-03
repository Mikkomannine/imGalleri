import { useParams } from 'react-router-dom';
import FollowButton from '../components/followButton';
import UnfollowButton from '../components/unfollowButton';
import '../css/profile.css';
import PostDetails from '../components/postDetails';
import { useEffect, useState } from 'react';
import FollowersList from '../components/followerList';
import FollowingList from '../components/FollowingList';
import ShareLinks from '../components/ShareLinks';

const ProfilePage = () => {
    const { id } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);
    const shareUrl = window.location.href;

    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/myprofile`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

    const checkFollowStatus = async () => {
        const response = await fetch(`/api/users/isFollowing/${id}`,{
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        setIsFollowing(data.isFollowing);
    };

    const fetchFollowers = async () => {
        const response = await fetch(`/api/users/followers/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        if (response.ok) {
            setFollowers(data);
        } else {
            console.error('Failed to fetch followers', data);
        }
    };
    const fetchFollowing = async () => {
        const response = await fetch(`/api/users/following/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        if (response.ok) {
            setFollowing(data);
        } else {
            console.error('Failed to fetch following', data);
        }
    };

    const getUserPosts = async () => {
        const response = await fetch(`/api/media/user/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        if (response.ok) {
            setPosts(data);
        } else {
            console.error('Failed to fetch posts', data);
        }
    };

    const getUserData = async () => {
        const response = await fetch(`/api/users/user/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
        }
        const data = await response.json();
        if (response.ok) {
            setUser(data);
        } else {
            console.error('Failed to fetch user', data);
        }
    };

    const handleLikeChange = async (postId) => {
        try {
            const response = await fetch(`/api/media/like/${postId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            if (!response.ok) throw new Error('Failed to like/unlike the post');
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: post.likes.includes(currentUserId)
                                ? post.likes.filter((id) => id !== currentUserId)
                                : [...post.likes, currentUserId]
                        }
                        : post
                )
            );
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    const handleFollowChange = () => {
        setIsFollowing(!isFollowing);
        fetchFollowers();
    };

    useEffect(() => {
        fetchCurrentUser();
        checkFollowStatus();
        fetchFollowers();
        getUserPosts();
        getUserData();
        fetchFollowing();
    }, [id]);

    if (!user || !currentUserId) return <div className='loading'><img src="/images/photo-gallery.png" alt="Loading..." /><p>Loading...</p></div>;

    return (
        <div className='profile'>
            <div className='header'>
                <div className='profilepicture'>
                    {user.imageUrl ? (
                        <img src={user.imageUrl} alt="Uploaded" />
                    ) : (
                        <img src="images/user.png" alt="Default" />
                    )}
                <div className='bio'>
                    <div className='bio-info'>
                    <h2>{user?.username}</h2>
                    <div className='bio-text'>
                        <p>{user?.bio}</p>
                    </div>
                    <div className='follow-button fade-follow-container'>
                        <div className={`fade-follow ${isFollowing ? 'fade-out' : 'fade-in'}`}> 
                            <FollowButton userId={id} onFollowChange={handleFollowChange} />
                        </div>
                        <div className={`fade-follow ${isFollowing ? 'fade-in' : 'fade-out'}`}> 
                            <UnfollowButton userId={id} onFollowChange={handleFollowChange} />
                        </div>
                    </div>
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
                {posts.length === 0 && <h2>No Posts Found</h2>}
                {posts.map((post) => (
                    <PostDetails
                        key={post._id}
                        post={post}
                        isLiked={post.likes.includes(currentUserId)}
                        likes={post.likes}
                        userId={user._id}
                        username={user.username}
                        shareUrl={shareUrl}
                        handleLikeChange={() => handleLikeChange(post._id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
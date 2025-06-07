import { useParams } from 'react-router-dom';
import FollowButton from '../components/followButton';
import UnfollowButton from '../components/unfollowButton';
import '../css/profile.css';
import PostDetails from '../components/postDetails';
import logo from './photo-gallery.png';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import image from './user.png';
import { useEffect, useState } from 'react';

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

    // Fetch current logged-in user ID
    const fetchCurrentUser = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/users/myprofile`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
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
        const data = await response.json();
        setIsFollowing(data.isFollowing);
    };

    const fetchFollowers = async () => {
        const response = await fetch(`/api/users/followers/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
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
        const data = await response.json();
        if (response.ok) {
            setPosts(data);
        } else {
            console.error('Failed to fetch posts', data);
        }
    };

    const getUserData = async () => {
        const response = await fetch(`http://localhost:3001/api/users/user/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        if (response.ok) {
            setUser(data);
            console.log('User following:', data.following);
        } else {
            console.error('Failed to fetch user', data);
        }
    };

    // Like/unlike handler
    const handleLikeChange = async (postId) => {
        try {
            const response = await fetch(`/api/media/like/${postId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            if (!response.ok) throw new Error('Failed to like/unlike the post');
            // Update posts state
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
        // eslint-disable-next-line
    }, [id]);

    if (!user || !currentUserId) return <div className='loading'><img src={logo} alt="Loading..." /><p>Loading...</p></div>;

    return (
        <div className='profile'>
            <div className='header'>
                <div className='profilepicture'>
                    {user.imageUrl ? (
                        <img src={user.imageUrl} alt="Uploaded" />
                    ) : (
                        <img src={image} alt="Default" />
                    )}
                </div>
                <div className='bio'>
                    <h2>{user?.username}</h2>
                    <div className='bio-text'>
                        <p>{user?.bio}</p>
                    </div>
                    <div className='follow-button'>
                        {isFollowing ? (
                            <UnfollowButton userId={id} onFollowChange={handleFollowChange} />
                        ) : (
                            <FollowButton userId={id} onFollowChange={handleFollowChange} />
                        )}
                    </div>
                    <div className="sharelinks">
                        <button>Share:</button>
                        <FacebookShareButton url={shareUrl} title={`Check out ${user?.username}'s profile!`}>
                            <img src="/images/facebook.png" alt="Facebook" />
                        </FacebookShareButton>
                        <TwitterShareButton url={shareUrl} title={`Check out ${user?.username}'s profile!`}>
                            <img src="/images/twitter.png" alt="Twitter" />
                        </TwitterShareButton>
                        <LinkedinShareButton url={shareUrl} title={`Check out ${user?.username}'s profile!`}>
                            <img src="/images/linkedin.png" alt="Linkedin" />
                        </LinkedinShareButton>
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
                <div className='followerlist'>
                    <h2>Following {following.length}</h2>
                    <ul>
                        {user.following.map((following) => (
                            <li key={following._id}>{following.username}</li>
                        ))}
                    </ul>
                </div>
                {showFollowers && (
                    <>
                        <ul className='followerlist'>
                            <h2>Followers:</h2>
                            {followers.map(follower => (
                                <li key={follower._id}>{follower.username}</li>
                            ))}
                        </ul>
                    </>
                )}
                {showFollowing && (
                    <>
                        <ul className='followerlist'>
                            <h2>Following:</h2>
                            {following.map(follow => (
                                <li key={follow._id}>{follow.username}</li>
                            ))}
                        </ul>
                    </>
                )}
    
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
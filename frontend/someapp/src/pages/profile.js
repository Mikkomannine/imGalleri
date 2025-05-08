import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FollowButton from '../components/followButton'; // Adjust the import path as necessary
import UnfollowButton from '../components/unfollowButton'; // Adjust the import path as necessary
import '../css/profile.css';
import PostDetails from '../components/postDetails';
import logo from './photo-gallery.png';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import image from './user.png';


const ProfilePage = () => {
    const { id } = useParams();
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers, setFollowers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    const shareUrl = window.location.href;
    
    const checkFollowStatus = async () => {
        const response = await fetch(`/api/users/isFollowing/${id}`,{
            method: 'GET',
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}`
             }});
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        console.log("follow status: ", data.isFollowing);
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

    const getUserPosts = async () => {
        const response = await fetch(`/api/media/user/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        console.log(data);
        if (response.ok) {
            setPosts(data);
        }
        else {
            console.error('Failed to fetch posts', data);
        }
    }

    const getUserData = async () => {
        const response = await fetch(`http://localhost:3001/api/users/user/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await response.json();
        console.log("userDATA", data);
        if (response.ok) {
            setUser(data);
        }
        else {
            console.error('Failed to fetch posts', data);
        }
    }

    const handleFollowChange = () => {
        setIsFollowing(!isFollowing);
        fetchFollowers();
    };

    useEffect(() => {
        checkFollowStatus();
        fetchFollowers();
        getUserPosts();
        getUserData();
    }, [id]);


if (!user) return <div className='loading'><img src={logo}></img><p>Loading...</p></div>;    
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
            </div>
            <div className="posts">
                {posts.length === 0 && <h2>No Posts Found</h2>}
                {posts.map((post) => (
                    <PostDetails key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};


export default ProfilePage;
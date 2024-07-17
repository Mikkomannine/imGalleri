import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FollowButton from '../components/followButton'; // Adjust the import path as necessary
import UnfollowButton from '../components/unfollowButton'; // Adjust the import path as necessary
import '../css/profile.css';
import PostDetails from '../components/postDetails';



const ProfilePage = () => {
    const { id } = useParams();
    const [isFollowing, setIsFollowing] = useState(false)
    const [followers, setFollowers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    
    const checkFollowStatus = async () => {
        const response = await fetch(`http://localhost:3001/api/users/isFollowing/${id}`,{
            method: 'GET',
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}`
             }});
        const data = await response.json();
        setIsFollowing(data.isFollowing);
        console.log("follow status: ", data.isFollowing);
    };

    const fetchFollowers = async () => {
        const response = await fetch(`http://localhost:3001/api/users/followers/${id}`, {
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
        const response = await fetch(`http://localhost:3001/api/media/user/${id}`, {
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

    
    return (
        <div className='profile'>
            <div className='bio'>
                <div className="picwrapper">
                    <img className='profilepic' src={user?.imageUrl} alt='profile' />
                </div>
                <div className='wrapper'>
                    <h2>{user?.email}</h2>
                    {isFollowing ? (
                        <UnfollowButton userId={id} onFollowChange={handleFollowChange} />
                    ) : (
                        <FollowButton userId={id} onFollowChange={handleFollowChange} />
                    )}
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
                {posts.length === 0 && <h2>No Posts Found</h2>}
                {posts.map((post) => (
                    <PostDetails key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};


export default ProfilePage;
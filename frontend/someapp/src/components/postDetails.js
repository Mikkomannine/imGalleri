import { Link } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import LikeButton from './likeButton';
import UnLikeButton from './unlikeButton';
import { useState, useEffect as UseEffect } from 'react';


const PostDetails = ({ post, isLiked, likes, userId, shareUrl, handleLikeChange }) => {
    const [username, setUsername] = useState("");

    UseEffect(() => {
        const fetchUsernameFromPost = async () => {
            if (!userId) return;
            try {
                const response = await fetch(`/api/users/user/${userId}`, {
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
                setUsername(data.username);
            } catch (error) {
                console.error("Error fetching username:", error);
            }
        }
        fetchUsernameFromPost();
    }
    , [userId]);
            
        
    return (
        <div className="post">
            <h1 className='post-title'>{post.title}</h1>
            <Link className="post-link" to={`/post/${post._id}`}>
            <img src={post.imageUrl} alt={post.title} />
            </Link>
            <div className="post-details">
                <div className="likes">
                    <div className="likebutton">
                        {isLiked ? (
                            <UnLikeButton userId={post._id} onLikeChange={handleLikeChange} />
                        ) : (
                            <LikeButton userId={post._id} onLikeChange={handleLikeChange} />
                        )}
                    </div>
                    <div className="likecount">
                        <h3>{likes.length}</h3>
                    </div>
                </div>
                <div className="share">
                    <FacebookShareButton url={shareUrl} title={`Check out ${post.title}'s profile!`}>
                        <img src="/images/facebook.png" alt="Facebook" />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl} title={`Check out ${post.title}'s profile!`}>
                        <img src="/images/twitter.png" alt="Twitter" />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl} title={`Check out ${post.title}'s profile!`}>
                        <img src="/images/linkedin.png" alt="Linkedin" />
                    </LinkedinShareButton>
                </div>
            </div>
            <p className="post-desc">{post.description}</p>
            <div className="post-info">
                <div className="date">
                    {new Date(post.createdAt).toLocaleString('en-GB', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    })}
                </div>
                <Link className="username-link" to={`/profile/${userId}`}>
                    {username}
                </Link>
            </div>
        </div>
    );
};

export default PostDetails;
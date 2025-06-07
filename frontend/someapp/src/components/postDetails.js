import { Link } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton } from 'react-share';
import LikeButton from './likeButton';
import UnLikeButton from './unlikeButton';


const PostDetails = ({ post, isLiked, likes, userId, username, shareUrl, handleLikeChange }) => {
    return (
        <div className="post">
            <h1>{post.title}</h1>
            <img src={post.imageUrl} alt={post.title} />
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
            <p className="postdesc">{post.description}</p>
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
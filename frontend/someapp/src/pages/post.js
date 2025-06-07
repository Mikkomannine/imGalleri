import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Post.css';
import CommentDetails from '../components/commentDetails';
import logo from './photo-gallery.png';
import PostDetails from '../components/postDetails';

const Post = () => {
    let { id } = useParams();
    const [post, setPost] = useState(null);
    const [userId, setUserId] = useState(null);
    const [comments, setComments] = useState(null);
    const [isLiked, setisLiked] = useState(null);
    const [likes, setLikes] = useState(null);
    const [comment, setComment] = useState('');
    const [username, setUsername] = useState(null);
    const shareUrl = window.location.href;
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchCurrentUser = async () => {
        const response = await fetch(`http://localhost:3001/api/users/myprofile`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        const data = await response.json();
        console.log("Current logged-in user ID:", data.user._id); // Log the user ID
        setCurrentUserId(data.user._id); // Assumes backend returns { _id, username, ... }
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        const charLimit = 200; // Set your character limit here

        if (comment.length > charLimit) {
            alert(`Your comment exceeds the ${charLimit} character limit. Please shorten it.`);
            return; // Prevent submission if character limit is exceeded
        }

        try {
            const response = await fetch(`/api/media/addComment/${id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ text: comment })
            });
        
            const data = await response.json();
        
            if (!response.ok) {
              throw new Error(data.message || 'Failed to add comment');
            }
        
            console.log('Comment added:', data);
            
            const newComment = data.media.comments[data.media.comments.length - 1]; // Get the newly added comment
            setComments((prevComments) => [...prevComments, newComment]);
            setComment('');

          } catch (error) {
            console.error('Error:', error.message);
            // Show user feedback, e.g., toast
          }
      };


    const checkLikedStatus = async () => {
        const response = await fetch(`/api/media/isLiked/${id}`,{
            method: 'GET',
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}`
             }});
        const data = await response.json();
        setisLiked(data.isLiked);
        console.log("like status: ", data.isLiked);
    }

  
      const fetchPost = async () => {
        const response = await fetch(`/api/media/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});

        const data = await response.json();
        setPost(data);
        setComments(data.comments);
        setLikes(data.likes);
        setUserId(data.user_id);
      };

    const fetchUserByPost = async () => {
        if (!userId) return; // Check if userId is available before making the request
        const response = await fetch(`http://localhost:3001/api/users/user/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        const data = await response.json();
        setUsername(data.username);
        console.log("user: ", data);
    };

    const handleLikeChange = () => {
        setisLiked(!isLiked);
        fetchPost();
    };

    useEffect(() => {
        fetchPost();
        checkLikedStatus();
        fetchCurrentUser(); // Fetch current user ID on component mount
    }, [id]);
    
    useEffect(() => {
        if (userId) {
            fetchUserByPost(); // Fetch the user only after userId is updated
        }
    }, [userId]);


    if (!post || !currentUserId) 
        return (
            <div className="loading">
                <img src={logo} alt="Loading..." /><p>Loading...</p>
            </div>
        );

    return (
    <div className="post-wrapper">
        <PostDetails
                post={post}
                isLiked={isLiked}
                likes={likes}
                userId={userId}
                username={username}
                shareUrl={shareUrl}
                handleLikeChange={handleLikeChange}
            />
        <div className='comments'>
        {comments.length} comments:
        <div className='commentsection'>
        {comments && [...comments].reverse().map((comment) => (
            <CommentDetails
                key={comment._id}
                comment={comment}
                currentUserId={currentUserId}
                mediaId={id}
                onDelete={(deletedId) =>
                    setComments((prev) => prev.filter((c) => c._id !== deletedId))
                }
            />
        ))}

            </div>
        <form className='comment-upload' onSubmit={handleCommentSubmit}>
            <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Comment</button>
        </form>
        </div>
        </div>
    );
  }


export default Post;
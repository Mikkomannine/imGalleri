import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/Post.css';
import CommentDetails from '../components/commentDetails';
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
    const API_BASE = process.env.REACT_APP_API_URL;

    const fetchCurrentUser = async () => {
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
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        const charLimit = 200;
        if (comment.length > charLimit) {
            alert(`Your comment exceeds the ${charLimit} character limit. Please shorten it.`);
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/api/media/addComment/${id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              body: JSON.stringify({ text: comment })
            });
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            const data = await response.json();
        
            if (!response.ok) {
              throw new Error(data.message || 'Failed to add comment');
            }
    
            const newComment = data.media.comments[data.media.comments.length - 1];
            setComments((prevComments) => [...prevComments, newComment]);
            setComment('');

          } catch (error) {
            console.error('Error:', error.message);
          }
      };


    const checkLikedStatus = async () => {
        const response = await fetch(`${API_BASE}/api/media/isLiked/${id}`,{
            method: 'GET',
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}`
             }});
        const data = await response.json();
        setisLiked(data.isLiked);
    }

  
      const fetchPost = async () => {
        const response = await fetch(`${API_BASE}/api/media/${id}`, {
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
        if (!userId) return;
        const response = await fetch(`${API_BASE}/api/users/user/${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});
        const data = await response.json();
        setUsername(data.username);
    };

    const handleLikeChange = () => {
        setisLiked(!isLiked);
        fetchPost();
    };

    useEffect(() => {
        fetchPost();
        checkLikedStatus();
        fetchCurrentUser();
    }, [id]);
    
    useEffect(() => {
        if (userId) {
            fetchUserByPost();
        }
    }, [userId]);


    if (!post || !currentUserId) 
        return (
            <div className="loading">
                <img src="/images/photo-gallery.png" alt="Loading..." /><p>Loading...</p>
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
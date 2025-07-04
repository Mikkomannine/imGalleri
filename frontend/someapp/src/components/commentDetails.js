import { Link } from 'react-router-dom';
import '../css/Post.css';
import { useState, useEffect } from 'react';
const CommentDetails = ({ comment, currentUserId, mediaId, onDelete }) => {
    const [user, setUser] = useState(null);
    const API_BASE = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`${API_BASE}/api/users/user/${comment.postedBy}`, {
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
            const user = await response.json();
            setUser(user);
        };
        fetchUser();
    }, [comment.postedBy]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;
        try {
            const response = await fetch(`${API_BASE}/api/media/delete/${mediaId}/${comment._id}`, {
                method: 'DELETE',
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
            if (!response.ok) throw new Error(data.message);
            if (onDelete) onDelete(comment._id);
        } catch (err) {
            console.error('Error deleting comment:', err.message);
        }
    };

    return (
        <div className='comment'>
            <div className='comment-text'>{comment.text}</div>
            {new Date(comment.createdAt).toLocaleString('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
            })}
            <div className='comment-user'>
            {user && (
                <Link to={`/profile/${comment.postedBy}`}>
                    {user.username}
                </Link>
            )}
            {((comment.postedBy?._id || comment.postedBy) === currentUserId) && (
            <button onClick={handleDelete} className="delete-button">
                <img src="/images/bin.png" alt="Delete" className="delete-icon" />
            </button>
        )}
        </div>
        </div>
    );
};

export default CommentDetails;
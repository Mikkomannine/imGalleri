

import { Link } from 'react-router-dom';
import '../css/Post.css';
import { useState, useEffect } from 'react';
const CommentDetails = ({ comment, currentUserId, mediaId, onDelete }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`http://localhost:3001/api/users/user/${comment.postedBy}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const user = await response.json();
            setUser(user);
        };
        fetchUser();
    }, [comment.postedBy]);

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/media/delete/${mediaId}/${comment._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

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
                <Link to={`/post/profile/${comment.postedBy}`}>
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
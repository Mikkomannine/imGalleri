import '../css/Post.css';

function LikeButton({ userId, onLikeChange }) {
  const API_BASE = process.env.REACT_APP_API_URL;
  const handleLike = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/media/like/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      if (!response.ok) {
        throw new Error('Failed to like the post');
      }

      onLikeChange();
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  return <button className="like" onClick={handleLike}><img src="/images/love.png" ></img></button>;
}

export default LikeButton;
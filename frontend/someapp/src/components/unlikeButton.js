import '../css/Post.css';

function UnlikeButton({ userId, onLikeChange }) {
  const API_BASE = process.env.REACT_APP_API_URL;
  const handleUnlike = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/media/unlike/${userId}`, {
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
        throw new Error('Failed to unlike the post');
      }
      onLikeChange();
    } catch (error) {
      console.error('Unlike error:', error);
    }
  };

  return <button className="unlike" onClick={handleUnlike}><img className="unlike" src="/images/save.png" ></img></button>;
}

export default UnlikeButton;
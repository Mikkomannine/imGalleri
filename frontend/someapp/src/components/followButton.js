import '../css/profile.css';

function FollowButton({ userId, onFollowChange }) {
  const API_BASE = process.env.REACT_APP_API_URL;
  const handleFollow = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users/follow/${userId}`, {
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
        throw new Error('Failed to follow user');
      }

      onFollowChange();
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  return <button className="follow" onClick={handleFollow}>Follow</button>;
}

export default FollowButton;
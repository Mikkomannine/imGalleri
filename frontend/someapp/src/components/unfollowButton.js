import '../css/profile.css';

function UnfollowButton({ userId, onFollowChange }) {
  const API_BASE = process.env.REACT_APP_API_URL;
  const handleUnfollow = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/users/unfollow/${userId}`, {
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
        throw new Error('Failed to unfollow user');
      }
        console.log(response);
      onFollowChange();
    } catch (error) {
      console.error('Unfollow error:', error);
    }
  };

  return <button className="unfollow" onClick={handleUnfollow}>Following</button>;
}

export default UnfollowButton;
import '../css/profile.css';

function UnfollowButton({ userId, onFollowChange }) {
  const handleUnfollow = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/unfollow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
       // body: JSON.stringify({ _id: localStorage.getItem('currentUserId') }),
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }
        console.log(response);
      onFollowChange(); // Callback to update UI based on follow/unfollow action
    } catch (error) {
      console.error('Unfollow error:', error);
    }
  };

  return <button className="unfollow" onClick={handleUnfollow}>Following</button>;
}

export default UnfollowButton;
import '../css/profile.css';

function FollowButton({ userId, onFollowChange }) {
  const handleFollow = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/follow/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming you have a way to get the current user's auth token
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        //body: JSON.stringify({ _id: localStorage.getItem('currentUserId') }), // Assuming current user's ID is stored in localStorage
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }
      console.log(response);

      onFollowChange(); // Callback to update UI based on follow/unfollow action
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  return <button className="follow" onClick={handleFollow}>Follow</button>;
}

export default FollowButton;
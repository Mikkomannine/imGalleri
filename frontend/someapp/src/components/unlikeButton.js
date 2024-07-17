import liked from './save.png';
import '../css/Post.css';

function UnlikeButton({ userId, onLikeChange }) {
  const handleUnlike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/media/unlike/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
       // body: JSON.stringify({ _id: localStorage.getItem('currentUserId') }),
      });

      if (!response.ok) {
        throw new Error('Failed to unlike the post');
      }
        console.log(response);
      onLikeChange(); // Callback to update UI based on follow/unfollow action
    } catch (error) {
      console.error('Unlike error:', error);
    }
  };

  return <button className="unlike" onClick={handleUnlike}><img className="unlike" src = {liked} ></img></button>;
}

export default UnlikeButton;
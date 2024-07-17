import like from './love.png';
import '../css/Post.css';

function LikeButton({ userId, onLikeChange }) {
  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/media/like/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Assuming you have a way to get the current user's auth token
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        //body: JSON.stringify({ _id: localStorage.getItem('currentUserId') }), // Assuming current user's ID is stored in localStorage
      });

      if (!response.ok) {
        throw new Error('Failed to like the post');
      }
      console.log(response);

      onLikeChange(); // Callback to update UI based on follow/unfollow action
    } catch (error) {
      console.error('Like error:', error);
    }
  };

  return <button className="like" onClick={handleLike}><img src = {like} ></img></button>;
}

export default LikeButton;
import { Link } from 'react-router-dom';

const FollowersList = ({ followers }) => (
  <div className="followerlist">
    <h2>Followers {followers.length}</h2>
    <ul>
      {followers.map((follower) => (
        <li key={follower._id}>
          <Link to={`/profile/${follower._id}`}>{follower.username}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default FollowersList;
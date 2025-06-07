import { Link } from 'react-router-dom';

const FollowingList = ({ following }) => (
  <div className="followerlist">
    <h2>Following {following.length}</h2>
    <ul>
      {following.map((following) => (
        <li key={following._id}>
          <Link to={`/profile/${following._id}`}>{following.username}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default FollowingList;
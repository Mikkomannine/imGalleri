

import { Link } from 'react-router-dom';

import '../css/Post.css';

const CommentDetails = ({comment}) => {
    return (
        <div className='comment'>
            <p>{comment.text}</p>
            <p>{comment.createdAt}</p>
            <Link to={`/post/profile/${comment.postedBy}`}>Profile</Link>
        </div>
    );
    }

export default CommentDetails;
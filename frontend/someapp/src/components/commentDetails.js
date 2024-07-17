

import { Link } from 'react-router-dom';
import '../css/Post.css';
import { useState, useEffect } from 'react';


const CommentDetails = ({comment}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`http://localhost:3001/api/users/user/${comment.postedBy}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }});
    
            const user = await response.json();
            console.log("user: ", user);
            setUser(user);
        };
        fetchUser();
    }, []);
    return (
        <div className='comment'>
            <p>{comment.text}</p>
            <p>{comment.createdAt}</p>
            {user && <p>{user.email}</p>}
            <Link to={`/post/profile/${comment.postedBy}`}>Profile</Link>
        </div>
    );
    }

export default CommentDetails;
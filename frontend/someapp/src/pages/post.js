import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/Post.css';
import CommentDetails from '../components/commentDetails';
import logo from './photo-gallery.png';
import LikeButton from '../components/likeButton';
import UnLikeButton from '../components/unlikeButton';
import axios from 'axios';



const Post = () => {
    let { id } = useParams();
    const [post, setPost] = useState(null);
    const [userId, setUserId] = useState(null);
    const [comments, setComments] = useState(null);
    const [isLiked, setisLiked] = useState(null);
    const [likes, setLikes] = useState(null);
    const [comment, setComment] = useState('');

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(`http://localhost:3001/api/media/addComment/` + id, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response) {
              console.log(response.data);
              setComment('');
            }
          } catch (error) {
              console.error("Error uploading comment", error);
          }
      };


    const checkLikedStatus = async () => {
        const response = await fetch(`http://localhost:3001/api/media/isLiked/${id}`,{
            method: 'GET',
             headers: { Authorization: `Bearer ${localStorage.getItem('token')}`
             }});
        const data = await response.json();
        setisLiked(data.isLiked);
        console.log("like status: ", data.isLiked);
    }

  
      const fetchPost = async () => {
        const response = await fetch(`http://localhost:3001/api/media/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }});

        const data = await response.json();
        setPost(data);
        setComments(data.comments);
        setLikes(data.likes);
        console.log("post: ", data);
        console.log("comments: ", data.comments);
        console.log("likes: ", data.likes);
        setUserId(data.user_id);
      };
  

    const handleLikeChange = () => {
        setisLiked(!isLiked);
        fetchPost();
    };

    useEffect(() => {
        fetchPost();
        checkLikedStatus();
    }, [id]);


    if (!post) return <div className='loading'><img src={logo}></img><p>Loading...</p></div>;
  
    return (
    <div className="post-wrapper">
        <div className = "post">
        <h1>{post.title}</h1>
            <img src={post.imageUrl} alt={post.title} />
        {isLiked ? (
                        <UnLikeButton userId={id} onLikeChange={handleLikeChange} />
                    ) : (
                        <LikeButton userId={id} onLikeChange={handleLikeChange} />
                    )}
        <h3 className='likecount'>{likes.length}</h3>
        <p>{post.description}</p>
        <Link to={`/post/profile/${userId}`}>Profile</Link>
        </div>
        <div className='commentsection'>
            {comments.length} comments
            {comments && comments.map((comment) => (
                <CommentDetails key={comment._id} comment={comment}>
                </CommentDetails>
            ))}
            </div>
        <form className='commentUpload' onSubmit={handleCommentSubmit}>
            <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Comment</button>
        </form>
      </div>
    );
  }


export default Post;
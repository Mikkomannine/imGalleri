const PostDetails = ({post}) => {

    return (
        <div className="post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <img src={post.imageUrl} alt="post" />
        </div>
    );
    }

export default PostDetails;
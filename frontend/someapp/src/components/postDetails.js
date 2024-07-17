import '../css/Post.css'

const PostDetails = ({post}) => {

    return (
        <div className="post">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <div className='image-frame'>
                <img src={post.imageUrl} alt="post" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
        </div>
    );
    }

export default PostDetails;
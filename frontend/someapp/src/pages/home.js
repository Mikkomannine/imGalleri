import { useEffect } from "react";
import PostDetails from "../components/postDetails";
import { useState } from "react";
import '../css/Home.css';


const Home = () => {
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const API_BASE = process.env.REACT_APP_API_URL;
    const [isLiked, setisLiked] = useState(false);


    const token = localStorage.getItem("token");
    const config = {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
    };
   useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/users/myprofile`, config);
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                const data = await response.json();
                setCurrentUserId(data.user._id);
            } catch (error) {
                console.error('Error fetching current user:', error);
            }
        }
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`${API_BASE}/api/media`, config);
            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return;
            }
            const data = await response.json();
            if (!response.ok) {
                console.log("error fetching posts");
                return;
            }
            setPosts(data);
        };
        fetchPosts();
    }, [isLiked]);

    const handleLikeChange = () => {
        setisLiked(!isLiked);
    };




if (!posts) return <div className='loading'><img src="/images/photo-gallery.png"></img><p>Loading...</p></div>;

   return (
        <div className="home">
            <div className="home-posts">
            {posts.map((post) => (
                    <PostDetails
                        key={post._id}
                        post={post}
                        isLiked={post.likes.includes(currentUserId)}
                        likes={post.likes}
                        userId={post.user_id}
                        shareUrl={`${window.location.origin}/post/${post._id}`}
                        handleLikeChange={handleLikeChange}
                    />
            ))}
            </div>
    </div>
);
}


export default Home;
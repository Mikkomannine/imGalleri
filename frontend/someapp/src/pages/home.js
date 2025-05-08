import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import '../css/Home.css';
import logo from './photo-gallery.png';


const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const config = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        const fetchPosts = async () => {
            const response = await fetch("/api/media", config);
            const data = await response.json();
            if (!response.ok) {
                console.log("errorrrr");
                return;
            }
            setPosts(data);
            console.log(data);
        };
        fetchPosts();
    }, []);

if (!posts) return <div className='loading'><img src={logo}></img><p>Loading...</p></div>;

   return (
        <div className="home">
        <div className="homeposts">
            {posts.map((post) => (
                <div key={post._id} className="post">
                    <Link to={`/post/${post._id}`} className="post-link">
                    <h2>{post.title}</h2>
                    </Link>
                    <Link to={`/post/${post._id}`} className="post-link">
                    <img src={post.imageUrl} alt={post.title} />
                    </Link>
                    <p>{post.description}</p>
                </div>
            ))}
        </div>
    </div>
    );
    };

export default Home;
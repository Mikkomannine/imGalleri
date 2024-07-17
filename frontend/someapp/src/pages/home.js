import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import '../css/Home.css';


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
            const response = await fetch("http://localhost:3001/api/media", config);
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

   return (
        <div className="home">
        <div className="homeposts">
            {posts.map((post) => (
                <div key={post._id} className="post">
                    <h2>{post.title}</h2>
                    <img src={post.imageUrl} alt={post.title} />
                    <p>{post.description}</p>
                    <Link to={`/post/${post._id}`}>Open</Link>
                </div>
            ))}
        </div>
    </div>
    );
    };

export default Home;
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const UpdatePost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchFruit = async () => {
            const res = await fetch('/api/fruit/' + id, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            

            if (res.ok) {
                console.log(data);
                setTitle(data.title);
                setDescription(data.description);
            }
            else {
                console.log("Error fetching fruit");
            }
        }
        fetchFruit();
    }, [id]);
    
    const updatePost = () => {
        axios.patch(`http://localhost:3001/media/${id}`, {
        title: title,
        description: description,
        }).then(() => {
        alert("Post updated successfully");
        });
    };
    
    return (
        <div className="create">
        <div className="create__form">
            <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            {imageUrl ? (
         <img src={imageUrl} alt="Uploaded" />
        ) : (
         <p>No image found. Please upload an image.</p>
        )}
            <textarea
            placeholder="Post Body"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <button onClick={updatePost}>Update Post</button>
        </div>
        </div>
    );
    };

export default UpdatePost;
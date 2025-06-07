import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import '../css/postform.css';
import image from './add-image.png'; // Import the image

import { useRef } from 'react';

const PostForm = () => {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [scale, setScale] = useState(1); // Added for scaling
    const navigate = useNavigate();
    const imagePreviewRef = useRef(null); // Reference for the image preview

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('scale', scale); // Send scale value to the server

        try {
          const response = await axios.post(`/api/media`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response) {
            console.log(response.data);
            setTitle('');
            setDescription('');
            setImageUrl('');
            alert('Post uploaded successfully');
            navigate('/myprofile');
          }
        } catch (error) {
            console.error("Error uploading post", error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        const reader = new FileReader();
        reader.onload = (e) => {
            if (imagePreviewRef.current) {
                imagePreviewRef.current.src = e.target.result;
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleScaleChange = (event) => {
        setScale(event.target.value);
        if (imagePreviewRef.current) {
            imagePreviewRef.current.style.transform = `scale(${event.target.value})`;
        }
    };

    const triggerFileInputClick = () => {
        document.getElementById('customFileInput').click();
    };
    return (
        <div className='postForm'>
            <form className='postForm-wrapper' onSubmit={handleSubmit}>
                <h1>Add Post</h1>
                <input
                    type="text"
                    placeholder="Title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input id="customFileInput" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
                <div className='choosefile'>
                    <button type="button" onClick={triggerFileInputClick}><img src={image} alt="Upload" /></button>
                    <div>Choose Image</div>
                </div>
        
                <div className="example-frame"> {/* Add this div with the class example-frame */}
                    <img ref={imagePreviewRef} alt="Preview" style={{ maxWidth: '100%', maxHeight: '400px' }} />
                </div>
                <input
                    type="range"
                    min="0.5"
                    max="4"
                    step="0.1"
                    value={scale}
                    onChange={handleScaleChange}
                />
                <div className='scale-label'>Scale: {scale}</div> {/* Display the scale value */}
                <textarea
                    className='desc'
                    placeholder="Description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className='buttons'>
                <button className='edit-button' type="submit">Publish</button>
                <button className='cancel-button' type="button" onClick={() => navigate('/myprofile')}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default PostForm;
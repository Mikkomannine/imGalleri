import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import '../css/postform.css';
import { useRef } from 'react';

const PostForm = () => {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [scale, setScale] = useState(1);
    const navigate = useNavigate();
    const imagePreviewRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const char_limit = 50;
        if (title.length > char_limit) {
            alert(`Title exceeds ${char_limit} characters!`);
            return;
        }
        const desc_char_limit = 500;
        if (description.length > desc_char_limit) {
            alert(`Description exceeds ${desc_char_limit} characters!`);
            return;
        }

        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('scale', scale);

        try {
          const response = await axios.post(`/api/media`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            validateStatus: () => true
          });
          if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
            return;
          }
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
                    <button type="button" onClick={triggerFileInputClick}><img src="images/add-image.png" alt="Upload" /></button>
                    <div>Choose Image</div>
                </div>
        
                <div className="example-frame">
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
                <div className='scale-label'>Scale: {scale}</div>
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
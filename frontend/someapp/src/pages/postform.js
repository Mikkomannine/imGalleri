import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';


const PostForm = () => {
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('description', description);

        const post = { title, description, imageUrl };
    
        try {
          const response = await axios.post(`http://localhost:3001/api/media`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                body: JSON.stringify(post),
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
        }
        catch (error) {
            console.error("Error uploading post", error);
        }
    }

    
    return (
        <div>
            <form onSubmit={handleSubmit}>
            <h1>Post Form</h1>
                 <textarea className='desc'
                    type="text"
                    placeholder="..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
            />
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <textarea className='desc'
                    type="text"
                    placeholder="..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
            />
            <button className='publish' type="submit">Publish</button>
            </form>
        </div>
    )
}

export default PostForm;
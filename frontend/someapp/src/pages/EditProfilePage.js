import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import logo from './photo-gallery.png';
import axios from 'axios';
import image from './user.png';

const UpdateProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`http://localhost:3001/api/users/myprofile`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            

            if (res.ok) {
                console.log(data);
                setUser(data.user);
                setFirstName(data.user.firstName);
                setLastName(data.user.lastName);
                setPhoneNumber(data.user.phoneNumber);
                setEmail(data.user.email);
                setBio(data.user.bio);
                setImageUrl(data.user.imageUrl);
            }
            else {
                console.log("Error fetching user data");
            }
        }
        fetchUser();
    }, [id, update]);
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        const profile = { firstName, lastName, phoneNumber, email, bio };
        const response = await fetch(`/api/users/${id}/edit`, {
            method: "PATCH",
            body: JSON.stringify(profile),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        if (response.ok) {
            navigate("/myprofile");
            console.log("Updated profile" + response);
        }
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result); // Set the image preview URL
                console.log("RESULT" + reader.result);
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
          alert('Please select a file first!');
          return;
        }
    
        const formData = new FormData();
        formData.append('image', file);
    
        try {
          const response = await axios.patch(`/api/users/upload/` + user._id, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          console.log(response.data);
          if (response.data) {
            alert('Image uploaded successfully');
            console.log("image uploaded!", response.data);
            setUpdate(true);
          } else {
            console.warn("No image URL found in upload response");
          }
        } catch (error) {
          console.error('Error uploading image:', error);
          alert('Error uploading image');
        }
      };
if (!user) return <div className='loading'><img src={logo}></img><p>Loading...</p></div>;
    return (
        <div className="update-wrapper">
            <h2>Update profile</h2>
            <div className='profilepicture'>
                  {imageUrl ? (
                     <img src={imageUrl} alt="Uploaded" />
                    ) : (
                      <img src={image} alt="Default" />
                    )}
            </div>
                    <form className='bio-buttons' onSubmit={handleSubmit}>
                        <label htmlFor="file-upload" className="custom-file-upload">
                        Choose pfp
                        </label>
                        <input id="file-upload" className='file-input' type="file" onChange={handleFileChange} />
                        <button className='bio-button' type="submit">Upload pfp</button>
                    </form>
                <form className='form' onSubmit={handleUpdate}>
                    <div>
                        <p>First name:</p>
                        <textarea
                            className="desc"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <p>Last name:</p>
                    <textarea
                        className="desc"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    ></textarea>
                    <p>Phone number:</p>
                    <textarea
                        className="desc"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    ></textarea>
                    <div>
                        <p>Email:</p>
                        <textarea
                            className="desc"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p>Bio:</p>
                        <textarea
                            className="desc"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className="update-profile">
                        <button className="edit-button" type="submit">
                            Update
                        </button>
                        <Link to="/myprofile">
                            <button className="cancel-button">Cancel</button>
                        </Link>
                    </div>
                </form>
        </div>
    );
    };

export default UpdateProfile;
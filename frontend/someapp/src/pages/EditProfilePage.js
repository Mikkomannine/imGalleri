
import { useParams, useNavigate} from "react-router-dom";
import useEditProfile from "../hooks/useEditProfile";
import useField from "../hooks/useField";


const EditProfilePage = () => {
    const { id } = useParams();
    const bio = useField("bio");
    const phoneNumber = useField("phone");
    const firstName = useField("firstName");
    const lastName = useField("lastName");
    const navigate = useNavigate();

    const { editProfile, error } = useEditProfile(`http://localhost:3001/api/users/${id}/edit`);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        await editProfile({ bio: bio.value, firstName: firstName.value, lastName: lastName.value, phoneNumber: phoneNumber.value });
        if (!error) {
            console.log("success");
            navigate("/myprofile");
        }
        else {
            console.log(error);
        }
    };

    return (
        <div>
        <h1>Edit Profile Page</h1>
        <form onSubmit={handleFormSubmit}>
            <input
                type="text"
                placeholder="First Name"
                name="firstName"
                required=""
                {...firstName}
            />
            <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                required=""
                {...lastName}
            />
            <input
                type="text"
                placeholder="Phone Number"
                name="phone"
                required=""
                {...phoneNumber}
            />
            <input
                type="text"
                placeholder="Bio"
                name="bio"
                required=""
                {...bio}
            />
            <button type="submit">Save Changes</button>
        </form>
        </div>
    );
    };

export default EditProfilePage;
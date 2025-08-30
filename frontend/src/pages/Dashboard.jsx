import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try{
                const response = await getProfile();
                const formattedData = {
                    id: response.data.user._id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    role: response.data.user.role,
                    profilePic: response.data.user.profilePic,
                    createdAt: response.data.user.createdAt,
                    updatedAt: response.data.user.updatedAt,
                    postsCount: response.data.postsCount 
                }

                setUserData(formattedData);
            }catch(error){
                toast.error("Failed to fetch profile data! Please try again")
                console.error('Error fetching profile data:', error.message);
            }
        };

        fetchProfile();
    }, []);

    const handleEdit = (user) => {
        navigate('/edit-profile', {state: {name: userData.name, file: userData.profilePic}});
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden py-10 flex flex-col items-center text-gray-900">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-10 w-full max-w-md space-y-4 flex flex-col items-center">
                <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
                <img src={userData.profilePic || "no-image-logo.png"} alt="Profile" className="w-28 h-28 rounded-full mb-4" />
                <p><strong>Name:</strong> {userData.name}</p>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Role:</strong> {userData.role}</p>
                <p><strong>Posts Count:</strong> {userData.postsCount}</p>
                {/* Edit button */}
                <button onClick={() => handleEdit(userData)} className="button">
                    Edit Profile
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
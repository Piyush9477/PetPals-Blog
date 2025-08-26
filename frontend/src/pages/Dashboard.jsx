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
                    id: req.data.user._id,
                    name: req.data.user.name,
                    email: req.data.user.email,
                    role: req.data.user.role,
                    profilePic: req.data.user.profilePic,
                    createdAt: req.data.user.createdAt,
                    updatedAt: req.data.user.updatedAt,
                    postsCount: req.data.postsCount 
                }
            }catch(error){
                toast.error("Failed to fetch profile data! Please try again")
                console.error('Error fetching profile data:', error.message);
            }
        }
    }, []);
}
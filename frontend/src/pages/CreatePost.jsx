import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/postsApi";
import { AuthContext } from "../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePost = () => {
    const { isLoggedIn, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        desc: "",
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        if(!isLoggedIn){
            toast.error("You need to log in to create a post");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        }
    }, [isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return (
        <div className="relative min-h-screen w-full flex justify-center items-center bg-gray-100">
            <ToastContainer />
        </div>
        );
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Title is required.");
            return;
        }

        if (!desc.trim()) {
            toast.error("Description is required.");
            return;
        }

        try{
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('desc', formData.desc);
            if(file){
                formDataToSend.append('file', file);
            }
            formDataToSend.append('createdBy', user?._id);
            const success = await createPost(formDataToSend);
            toast.success("Post created successfully");
            setTimeout(() => {
                navigate("/home");
            }, 1500);

        } catch(error){
            toast.error("Failed to create post! Please try again");
            console.error("Failed to create post:", error.response?.data || error.message);
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 py-10">
            <ToastContainer />

        </div>
    );
}
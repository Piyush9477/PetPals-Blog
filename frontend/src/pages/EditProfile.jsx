import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { editProfile } from "../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract initial data from navigation state
    const {name: initialName = "", file: initialFile = null} = location.state || {};

    // Form state
    const [formData, setFormData] = useState({
        name: initialName
    });
    const [selectedImage, setSelectedImage] = useState(initialFile); 
    const [file, setFile] = useState(null); 

    // Update formData on input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Handle file input change
    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSelectedImage(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setSelectedImage(initialFile); 
        }
    };

    // Submit form handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name} = formData;

        if (!name) {
            toast.error("Name is required.");
            return;
        }

        try{
            const formDataToSend = new FormData();
            formDataToSend.append("name", name);

            if (file) {
                formDataToSend.append("file", file);
            }

            await editProfile(formDataToSend);

            toast.success("Profile updated successfully");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
        } catch (error) {
            toast.error("Failed to update profile! Please try again");
            console.error("Failed to update profile:", error.response?.data || error.message);
        }
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden py-10 flex flex-col items-center text-gray-900">
            <ToastContainer />
            <form
                className="text-gray-900 rounded-lg shadow-md w-full max-w-lg px-8 py-6 flex flex-col gap-5"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <h2 className="text-2xl font-bold mb-5 text-center">Edit Profile</h2>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="font-medium">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter name"
                        className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                        required
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="file" className="font-medium">
                        Profile Picture
                    </label>
                    <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file:border file:border-gray-300 file:px-3 file:py-2 file:rounded text-gray-900 bg-white"
                    />
                    {selectedImage && (
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="w-28 h-28 rounded-full mb-4"
                        />
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white rounded px-4 py-2 mt-4 hover:bg-blue-700 transition-all"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default EditProfile;
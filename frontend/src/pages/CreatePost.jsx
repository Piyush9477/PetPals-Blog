import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/postsApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreatePost = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        desc: "",
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSelectedImage(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setSelectedImage(null);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title) {
            toast.error("Title is required.");
            return;
        }

        if (!desc) {
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
            await createPost(formDataToSend);
            toast.success("Post created successfully");
            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch(error){
            toast.error("Failed to create post! Please try again");
            console.error("Failed to create post:", error.response?.data || error.message);
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
            <h2 className="text-2xl font-bold mb-5 text-center">Create New Post</h2>

            {/* Title */}
            <div className="flex flex-col gap-2">
            <label htmlFor="title" className="font-medium">
                Title <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter post title"
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                required
            />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
            <label htmlFor="desc" className="font-medium">
                Description <span className="text-red-500">*</span>
            </label>
            <textarea
                id="desc"
                value={formData.desc}
                onChange={handleChange}
                placeholder="Enter post description"
                rows={4}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
                required
            />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
            <label htmlFor="file" className="font-medium">
                Image (optional)
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
                className="mt-2 w-32 h-32 object-cover rounded"
                />
            )}
            </div>

            {/* Submit */}
            <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 mt-4 hover:bg-blue-700 transition-all"
            >
            Create Post
            </button>
        </form>
        </div>

    );
}

export default CreatePost;
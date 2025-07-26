import { useState } from 'react';
import { registerUser } from "../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [profilePic, setProfilePic] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const validateForm = () => {
        const { name, email, password } = formData;
        if (!name.trim()) return "Full Name is required.";
        if (name.length > 15) return "Full Name cannot exceed 15 characters.";

        const emailRegex =
        /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|protonmail\.com|hotmail\.com|forexru\.com)$/;
        if (!email.trim()) return "Email is required.";
        if (!emailRegex.test(email))
        return "Please enter a valid email (Gmail, Yahoo, Outlook, etc.).";

        // const passwordRegex =
        // /^(?=.*[0-9])(?=.*[!@#$%^&])[a-zA-Z0-9!@#$%^&]{6,15}$/;
        if (!password) return "Password is required.";
        // if (!passwordRegex.test(password))
        // return "Password must be 6-15 characters long, with at least one number and one special character.";

        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            toast.error(validationError);
            return;
        }

        setLoading(true);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('password', formData.password);
            if (profilePic) {
                formDataToSend.append('profilePic', profilePic);
            }
            const success = await registerUser(formDataToSend);
            toast.success("Registration Successful! Redirecting...");
            setTimeout(() => {
                navigate("/verify-user", { state: { email: formData.email } });
            }, 2000);
        } catch (err) {
            toast.error("Registration failed! Please try again.");
            console.error('Registration Failed:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
        });
        setSelectedImage(null);
        setProfilePic(null);
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        setProfilePic(file);
    }

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            <ToastContainer />
            {/* Background image */}
            <img
                src="https://images.unsplash.com/photo-1525253013412-55c1a69a5738?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="background"
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Login form */}
            <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
            <div className="bg-white bg-opacity-90 shadow-2xl rounded-2xl p-10 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">Welcome to PetPals-Blog</h1>
                <h2 className="text-xl text-center text-gray-600 mt-1 mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                            placeholder="Full Name"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 mt-1 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-0 top-6 text-gray-500"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    {/* Profile Image Upload Section */}
                    <div className="flex flex-col items-center mb-6">
                        <label className="cursor-pointer flex flex-col items-center justify-center w-full p-4 rounded-xl bg-gray-700 text-white hover:bg-gray-600">
                            {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt="Profile Preview"
                                className="w-16 h-16 rounded-full object-cover mb-2"
                            />
                            ) : (
                            <div className="flex flex-col items-center">
                                <span>Upload Profile Image</span>
                            </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-between gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full ${
                                loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            } text-white font-semibold py-2 px-4 rounded-md transition duration-200`}
                        >
                            {loading ? "Registering..." : "Register"}
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            className="w-full bg-grey-600 hover:bg-grey-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                        >
                            Clear
                        </button>
                    </div>

                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline cursor-pointer">
                        Login
                    </Link>
                </p>
            </div>
            </div>
        </div>
    );
}

export default Register;
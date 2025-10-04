import { useState, useContext } from 'react';
import { loginUser } from "../api/authApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {setIsLoggedIn, setUser} = useContext(AuthContext);

    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|protonmail\.com|hotmail\.com|forexru\.com)$/;
        return emailRegex.test(email);
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Email is required.");
            return;
        } else if (!validateEmail(email)) {
            toast.error("Invalid email. Please enter a valid email address.");
            return;
        }

        try {
            const res = await loginUser({ email, password });
            console.log('Login Success:', res.data);
            localStorage.setItem('authToken', res.data.user.token);
            setIsLoggedIn(true);
            setUser(res.data.user);
            toast.success("Login Successful");
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (err) {
            if (err.response?.status === 403) {
                toast.error("Your email is not verified. Please verify before login.");
                setTimeout(() => {
                    navigate("/verify-user", { state: { email } });
                }, 2000);
            }
            else{
                toast.error("Incorrect email or password. Please try again.");
            }
            console.error('Login Failed:', err.response?.data || err.message);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if(!email) {
            toast.error("Email is required.");
            return;
        }
        try{
            navigate("/forgot-password", { state: { email } });
        }catch(err){
           console.error('Navigation to Forgot password page failed:', err.response?.data || err.message); 
        }
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
                <h2 className="text-xl text-center text-gray-600 mt-1 mb-6">Login</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    
                    <button 
                        type="button" 
                        onClick={handleForgotPassword} 
                        className="forgot-password-button"
                    >
                        Forgot Password?
                    </button>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline cursor-pointer">
                        Sign Up
                    </Link>
                </p>
            </div>
            </div>
        </div>
    );
}

export default Login;
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendForgotPasswordCode, setNewPassword } from "../api/authApi"
import { toast, ToastContainer } from "react-toastify";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
    const [OTP, setOTP] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const sendOtpCalled = useRef(false);

    useEffect(() => {
        const sendOTP = async () => {
            try{
                await sendForgotPasswordCode({email});
                toast.success("Forgot password code sent to your email");
            } catch (error) {
                console.error("Failed to send forgot password code", error);
                toast.error("Failed to send OTP. Try again later.");
            }
        };

        if(email && !sendOtpCalled.current) {
            sendOtpCalled.current = true; 
            sendOTP();
        }

    }, [email]);

    const closeModal = () => {
        navigate(-1); //navigate to previous page
    };

    const handleSybmit = async (e) => {
        e.preventDefault();

        try {
            const res = await setNewPassword({ email, code: OTP, newPassword });
            toast.success("Password updated successfully");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("User not found");
            }
            else if (error.response?.status === 400) {
                toast.error("Incorrect code");
            } else {
                toast.error("Something went wrong");
            }
        }
    }

    return (
        <>
        <ToastContainer />
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full relative">
                <form onSubmit={handleSubmit}>
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-4 text-gray-500 hover:text-black text-lg"
                    >
                        ✖
                    </button>
                    <h2 className="text-xl font-semibold mb-4 text-center text-gray-500">Forgot Password</h2>
                    <p className="mb-4 text-center text-gray-500">We've sent an OTP to: <strong>{email}</strong></p>

                    {/* OTP and new password Input Field */}
                    <input
                        type="text"
                        value={OTP}
                        onChange={(e) => setOTP(e.target.value)}
                        placeholder="Enter OTP"
                        className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-800"
                    />
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-800"
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

                    {/* Set New Password Button */}
                    <button type="submit" className="w-full bg-blue-600 text-gray-500 py-2 rounded hover:bg-blue-700">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
        </>
    );
}

export default ForgotPassword;
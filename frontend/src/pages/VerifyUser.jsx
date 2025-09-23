import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { sendVerificationEmail, verifyUser } from "../api/authApi"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyUser = () => {
    const [OTP, setOTP] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;
    const sendOtpCalled = useRef(false); 

    useEffect(() => {
        const sendOTP = async () => {
            try{
                await sendVerificationEmail({email});
                toast.success("Please verify your email. Verification code sent to your email");
            } catch(error){
                console.error("Failed to send verification email", error);
                toast.error("Failed to send OTP. Try again later.");
            }
        };

        if (email && !sendOtpCalled.current) {
            sendOtpCalled.current = true; 
            sendOTP();
        }

    }, [email]);

    const closeModal = () => {
        navigate(-1); //navigate to previous page
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const res = await verifyUser({email, code: OTP});
            toast.success("User verified successfully");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch(error){
            if(error.response?.status === 404){
                toast.error("User not found");
            }
            else if(error.response?.status === 400){
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
                        <h2 className="text-xl font-semibold mb-4 text-center text-gray-500">Verify Your Email</h2>
                        <p className="mb-4 text-center text-gray-500">We've sent an OTP to: <strong>{email}</strong></p>

                        {/* OTP Input Field */}
                        <input
                            type="text"
                            value={OTP}
                            onChange={(e) => setOTP(e.target.value)}
                            placeholder="Enter OTP"
                            className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-800"
                        />

                        {/* Verify Button */}
                        <button type="submit" className="w-full bg-blue-600 text-gray-500 py-2 rounded hover:bg-blue-700">
                            Verify User
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default VerifyUser;
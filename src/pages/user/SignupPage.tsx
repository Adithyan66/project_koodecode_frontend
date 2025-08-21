import React, { useEffect, useState } from 'react';

import LoginHero from "../../assets/images/login_student-removebg-preview.png"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import { Check } from 'lucide-react';
import axios from 'axios';




const SignupPage: React.FC = () => {


    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate()


    const [otpPage, setOtpPage] = useState(false)

    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timeLeft, setTimeLeft] = useState(29);
    const [showPasswordSection, setShowPasswordSection] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    // Handle OTP input change
    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto focus next input
            if (value && index < 4) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }

            // Show password section if all OTP fields are filled
            if (newOtp.every(digit => digit !== '')) {
                setTimeout(() => setShowPasswordSection(true), 500);
            }
        }
    };

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };


    async function requestOtp() {
        try {
            const response = await axios.post("http://localhost:3000/auth/signup/request-otp", {
                email,
                userName: username,
                fullName: name
            });
            console.log("✅ Signup success:", response.data);
            if (response.data.success) {
                setOtpPage(true)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("❌ Axios error:", error.response?.data || error.message);
            } else {
                console.error("❌ Unexpected error:", error);
            }
        }
    }

    async function createAccount() {
        try {
            const response = await axios.post("http://localhost:3000/auth/signup/verify-otp", {
                email,
                password: confirmPassword,
                otp: Number(otp.join(""))
            });

            if (response.data.success) {
                navigate("/")
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("❌ Axios error:", error.response?.data || error.message);
            } else {
                console.error("❌ Unexpected error:", error);
            }
        }
    }



    return (
        <div className="min-h-screen bg-black text-white">

            <Navbar />
            <div className="flex min-h-[calc(100vh-88px)]">
                {/* Left side with character */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="relative">
                        <img
                            src={LoginHero}
                            alt="Character"
                            className="w-150 h-150 object-cover rounded-full opacity-80"
                        />
                    </div>
                </div>
                {/* Right side with signup form */}
                {(!otpPage) ?
                    <div className="flex-1 flex flex-col justify-center items-center p-8">
                        <div className="w-full max-w-md">
                            <div className="space-y-6 mb-6">
                                {/* Name and User Name fields - side by side */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">User Name</label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Email field - full width */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                    />
                                </div>

                                {/* Create Account button */}
                                <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
                                    // onClick={() => setOtpPage(true)}
                                    onClick={() => requestOtp()}
                                >
                                    Create Account
                                </button>
                            </div>

                            {/* Login link */}
                            <div className="text-center mb-8">
                                <span className="text-gray-400">Already have an account? </span>
                                <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                                    Login
                                </Link>
                            </div>

                            {/* Divider with "or" */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-black text-gray-400">or</span>
                                </div>
                            </div>

                            {/* Social signup buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Google signup */}
                                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border">
                                        <span className="text-xs font-bold text-red-500">G</span>
                                    </div>
                                    <span className="text-sm">Sign up with Google</span>
                                </button>

                                {/* Facebook signup */}
                                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                >
                                    <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600">f</span>
                                    </div>
                                    <span className="text-sm">Sign up with Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="flex-1 flex flex-col justify-center items-center p-8">
                        <div className="w-full max-w-md">
                            {/* 2FA Section */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold mb-4">2 Factor Authentication</h1>
                                <p className="text-gray-400 mb-8">Check your email and enter your one-time-password.</p>

                                {/* OTP Input Boxes */}
                                <div className="flex justify-center space-x-3 mb-6">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-12 bg-transparent border-2 border-gray-600 rounded-lg text-center text-white text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors"
                                        />
                                    ))}
                                </div>

                                {/* Timer */}
                                <p className="text-gray-400 mb-4">
                                    OTP will Expires in <span className="text-white font-semibold">00:{timeLeft.toString().padStart(2, '0')}</span>
                                </p>

                                {/* Didn't get OTP link */}
                                <button className="text-gray-500 hover:text-gray-400 underline text-sm">
                                    I didn't get the OTP
                                </button>
                            </div>

                            {/* Password Creation Section */}
                            <div className={`transition-all duration-500 ${showPasswordSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                                {showPasswordSection && (
                                    <>
                                        {/* Success Icon */}
                                        <div className="flex justify-center mb-6">
                                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                                <Check size={32} className="text-white" />
                                            </div>
                                        </div>

                                        {/* Create Password Section */}
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold mb-6">Create Password</h2>

                                            <div className="space-y-4">
                                                {/* Password field */}
                                                <input
                                                    type="password"
                                                    placeholder="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                                />

                                                {/* Confirm Password field */}
                                                <input
                                                    type="password"
                                                    placeholder="confirm password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                                                />

                                                {/* Create Account Button */}
                                                <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-lg transition-colors mt-6"
                                                    onClick={() => createAccount()}
                                                >
                                                    Create Account
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
};


export default SignupPage;
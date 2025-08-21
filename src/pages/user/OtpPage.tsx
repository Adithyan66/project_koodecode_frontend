import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';

import LoginHero from "../../assets/images/login_student-removebg-preview.png"
import Navbar from '../../components/user/Navbar';


const OTPPage: React.FC = () => {
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

                {/* Right side with forms */}
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
                                            <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-lg transition-colors mt-6">
                                                Create Account
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPPage;
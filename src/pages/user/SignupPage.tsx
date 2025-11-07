

import React from 'react';
import 'react-toastify/dist/ReactToastify.css';

import LoginHero from "../../assets/images/login_student-removebg-preview.png"
import { Link } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import AuthOButtons from '../../components/user/buttons/Auth0Buttons';
import { useSignup } from '../../app/hooks/auth/useSignup';

const SignupPage: React.FC = () => {
    const {
        confirmPassword,
        createAccount,
        email,
        handleKeyDown,
        handleOtpChange,
        isLoading,
        name,
        otp,
        otpPage,
        password,
        requestOtp,
        resetOtp,
        setConfirmPassword,
        setEmail,
        setName,
        setPassword,
        setUsername,
        showPasswordSection,
        timeLeft,
        username,
        validateEmail,
        validateName,
        validatePassword,
        validateUsername
    } = useSignup();

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
                {(!otpPage) ? (
                    <div className="flex-1 flex flex-col justify-center items-center p-8">
                        <div className="w-full max-w-md">
                            <div className="space-y-6 mb-6">
                                {/* Name and Username fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${name && !validateName(name)
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
                                                }`}
                                            placeholder="Enter your name"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${username && !validateUsername(username)
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
                                                }`}
                                            placeholder="Enter username"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Email field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${email && !validateEmail(email)
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
                                            }`}
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Create Account button */}
                                <button
                                    className={`w-full font-semibold py-4 rounded-lg transition-colors hover:cursor-pointer ${isLoading
                                        ? 'bg-green-600 cursor-not-allowed'
                                        : 'bg-green-700 hover:bg-green-600'
                                        } text-white`}
                                    onClick={requestOtp}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending OTP...' : 'Create Account'}
                                </button>
                            </div>

                            {/* Login link */}
                            <div className="text-center mb-8">
                                <span className="text-gray-400">Already have an account ? </span>
                                <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                                    Login
                                </Link>
                            </div>

                            {/* Divider and social buttons - keep existing code */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-black text-gray-400">or</span>
                                </div>
                            </div>



                            <AuthOButtons isSubmitting={isLoading} process='signup' />
                        </div>
                    </div>
                ) : (
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
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>

                                {/* Timer */}
                                <p className="text-gray-400 mb-4">
                                    OTP will expire in <span className="text-white font-semibold">00:{timeLeft.toString().padStart(2, '0')}</span>
                                </p>

                                {/* Resend OTP button */}
                                <button
                                    className={`text-sm underline transition-colors ${timeLeft > 0 || isLoading
                                        ? 'text-gray-500 cursor-not-allowed'
                                        : 'text-green-400 hover:text-green-300'
                                        }`}

                                            onClick={() => {
                                                if (timeLeft === 0 && !isLoading) {
                                                    resetOtp();
                                                    requestOtp();
                                                }
                                            }}
                                    disabled={timeLeft > 0 || isLoading}
                                >
                                    {isLoading ? 'Resending...' : timeLeft > 0 ? `Resend OTP ` : 'Resend OTP'}
                                </button>
                            </div>

                            {/* Password Creation Section */}
                            <div className={`transition-all duration-500 ${showPasswordSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>


                                {/* Create Password Section */}
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-6">Create Password</h2>

                                    <div className="space-y-4">
                                        {/* Password field */}
                                        <div>
                                            <input
                                                type="password"
                                                placeholder="Password (minimum 6 characters)"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none transition-colors ${password && !validatePassword(password)
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : 'border-gray-600 focus:border-green-500'
                                                    }`}
                                                disabled={isLoading}
                                            />
                                        </div>

                                        {/* Confirm Password field */}
                                        <div>
                                            <input
                                                type="password"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none transition-colors ${confirmPassword && password !== confirmPassword
                                                    ? 'border-red-500 focus:border-red-500'
                                                    : 'border-gray-600 focus:border-green-500'
                                                    }`}
                                                disabled={isLoading}
                                            />
                                        </div>

                                        {/* Create Account Button */}
                                        <button
                                            className={`w-full font-semibold py-3 rounded-lg transition-colors mt-6 hover:cursor-pointer ${isLoading
                                                ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                                                : 'bg-white hover:bg-gray-100 text-black'
                                                }`}
                                            onClick={createAccount}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Creating Account...' : 'Create Account'}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignupPage;

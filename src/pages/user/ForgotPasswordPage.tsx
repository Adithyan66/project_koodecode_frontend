import React, { useEffect, useState } from 'react';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import LoginHero from "../../assets/images/login_student-removebg-preview.png";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { authAPI } from '../../services/axios/auth/authService';

interface ForgotPasswordPageProps { }

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = () => {
    // States for different steps
    const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isLoading, setIsLoading] = useState(false);

    // Error states
    const [errors, setErrors] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Timer effect for OTP expiration
    useEffect(() => {
        let interval: number | undefined
        if (currentStep === 'otp' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [currentStep, timeLeft]);

    // Validate individual fields
    const validateField = (field: string, value: string | string[]) => {
        let error = '';

        switch (field) {
            case 'email':
                if (!value || typeof value !== 'string' || !value.trim()) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'otp':
                if (Array.isArray(value)) {
                    const otpString = value.join('');
                    if (otpString.length !== 5) {
                        error = 'Please enter the complete OTP';
                    } else if (!/^\d+$/.test(otpString)) {
                        error = 'OTP should contain only numbers';
                    }
                }
                break;
            case 'newPassword':
                if (!value || typeof value !== 'string' || !value.trim()) {
                    error = 'New password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters long';
                }
                break;
            case 'confirmPassword':
                if (!value || typeof value !== 'string' || !value.trim()) {
                    error = 'Please confirm your password';
                } else if (value !== newPassword) {
                    error = 'Passwords do not match';
                }
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [field]: error
        }));

        return error === '';
    };

    // Input change handlers
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (errors.email && value.trim()) {
            setTimeout(() => validateField('email', value), 500);
        }
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);

        if (errors.newPassword && value.trim()) {
            setTimeout(() => validateField('newPassword', value), 500);
        }

        // Also revalidate confirm password if it exists
        if (confirmPassword && value !== confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: 'Passwords do not match'
            }));
        } else if (confirmPassword && value === confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: ''
            }));
        }
    };

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (errors.confirmPassword && value.trim()) {
            setTimeout(() => validateField('confirmPassword', value), 500);
        }
    };

    // OTP handling functions
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow digits

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 4) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }

        // Clear OTP error when user starts typing
        if (errors.otp && value) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }

        // Auto-verify when all fields are filled
        if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 5) {
            setTimeout(() => validateField('otp', newOtp), 100);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    // Form validation functions
    const isEmailFormValid = () => {
        return email.trim() !== '' && emailRegex.test(email) && !errors.email;
    };

    const isOtpFormValid = () => {
        return otp.every(digit => digit !== '') && !errors.otp;
    };

    const isResetFormValid = () => {
        return newPassword.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            newPassword.length >= 6 &&
            newPassword === confirmPassword &&
            !errors.newPassword &&
            !errors.confirmPassword;
    };

    // API call functions (replace with your actual API calls)
    // const requestPasswordReset = async (email: string) => {
    //     // Replace with your actual API call
    //     console.log('Requesting password reset for:', email);
    //     // Simulate API call
    //     return new Promise((resolve) => setTimeout(resolve, 1000));
    // };

    // const verifyOtp = async (email: string, otpCode: string) => {
    //     // Replace with your actual API call
    //     console.log('Verifying OTP:', otpCode, 'for email:', email);
    //     // Simulate API call
    //     return new Promise((resolve) => setTimeout(resolve, 1000));
    // };

    const resetPassword = async (email: string, otpCode: string, newPassword: string) => {
        // Replace with your actual API call
        console.log('Resetting password for:', email);
        // Simulate API call
        return new Promise((resolve) => setTimeout(resolve, 1000));
    };

    const resendOtp = async (email: string) => {
        // Replace with your actual API call
        console.log('Resending OTP for:', email);
        // Simulate API call
        return new Promise((resolve) => setTimeout(resolve, 1000));
    };

    // Form submission handlers
    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateField('email', email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            await authAPI.requestPasswordReset(email);
            toast.success('OTP sent to your email address');  
            setCurrentStep('otp');
            setTimeLeft(60);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // const handleOtpSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();

    //     if (!validateField('otp', otp)) {
    //         toast.error('Please enter a valid OTP');
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     try {
    //         await verifyOtp(email, otp.join(''));
    //         toast.success('OTP verified successfully');
    //         setCurrentStep('reset');
    //     } catch (error: any) {
    //         toast.error(error?.message || 'Invalid OTP. Please try again.');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    const handlePasswordResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newPasswordValid = validateField('newPassword', newPassword);
        const confirmPasswordValid = validateField('confirmPassword', confirmPassword);

        if (!newPasswordValid || !confirmPasswordValid) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            await resetPassword(email, otp.join(''), newPassword);
            toast.success('Password reset successfully');
            navigate('/login');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        if (timeLeft > 0 || isLoading) return;

        setIsLoading(true);

        try {
            await resendOtp(email);
            setOtp(['', '', '', '', '']);
            setTimeLeft(60);
            toast.success('OTP resent successfully');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to resend OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 'email':
                return (
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <h1 className="text-5xl font-bold mb-2">Forgot Password</h1>
                            <p className="text-gray-400">Enter your email address and we'll send you an OTP to reset your password</p>
                        </div>

                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            {/* Email field */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Mail size={20} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.email
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                                        }`}
                                    disabled={isSubmitting}
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1 ml-1">{errors.email}</p>
                                )}
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={!isEmailFormValid() || isSubmitting}
                                className={`w-full font-semibold py-4 rounded-lg transition-colors uppercase tracking-wider ${!isEmailFormValid() || isSubmitting
                                    ? 'bg-green-600 text-green-400 cursor-not-allowed'
                                    : 'bg-green-700 hover:bg-green-600 text-white'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>
                        </form>

                        {/* Back to login */}
                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium inline-flex items-center">
                                <ArrowLeft size={16} className="mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                );

            case 'otp':
                return (
                    <div className="w-full max-w-md">
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

                            {errors.otp && (
                                <p className="text-red-400 text-sm mb-4">{errors.otp}</p>
                            )}

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
                                onClick={handleResendOtp}
                                disabled={timeLeft > 0 || isLoading}
                            >
                                {isLoading ? 'Resending...' : timeLeft > 0 ? `Resend OTP` : 'Resend OTP'}
                            </button>
                        </div>

                        <form onSubmit={handlePasswordResetSubmit} className="space-y-6">
                            {/* New Password field */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                    className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.newPassword
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                                        }`}
                                    disabled={isSubmitting}
                                />
                                {errors.newPassword && (
                                    <p className="text-red-400 text-sm mt-1 ml-1">{errors.newPassword}</p>
                                )}
                            </div>

                            {/* Confirm Password field */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.confirmPassword
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                                        }`}
                                    disabled={isSubmitting}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-400 text-sm mt-1 ml-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Reset button */}
                            <button
                                type="submit"
                                disabled={!isResetFormValid() || isSubmitting}
                                className={`w-full font-semibold py-4 rounded-lg transition-colors uppercase tracking-wider ${!isResetFormValid() || isSubmitting
                                    ? 'bg-green-600 text-green-400 cursor-not-allowed'
                                    : 'bg-green-700 hover:bg-green-600 text-white'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting Password...
                                    </span>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </form>

                        {/* Back button */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setCurrentStep('email')}
                                className="text-green-400 hover:text-green-300 font-medium inline-flex items-center"
                                disabled={isSubmitting}
                            >
                                <ArrowLeft size={16} className="mr-2" />
                                Change Email
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
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

                {/* Right side with form */}
                <div className="flex-1 flex flex-col justify-center items-center p-8">
                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

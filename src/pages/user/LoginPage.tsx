

import React, { useEffect, useState } from 'react';
import { User, Lock } from 'lucide-react';
import LoginHero from "../../assets/images/login_student-removebg-preview.png"
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser } from '../../features/auth/userThunks';
import AuthOButtons from '../../components/user/buttons/Auth0Buttons';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    const dispatch = useAppDispatch()
    const navigate = useNavigate();

    const { user, status } = useAppSelector(state => state.user);
    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate individual fields
    const validateField = (field: string, value: string) => {
        let error = '';

        switch (field) {
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'password':
                if (!value.trim()) {
                    error = 'Password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters long';
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

    // Validate entire form
    const validateForm = () => {
        const emailValid = validateField('email', email);
        const passwordValid = validateField('password', password);

        return emailValid && passwordValid;
    };

    // Check if form is valid (for button enabling)
    const isFormValid = () => {
        return email.trim() !== '' &&
            password.trim() !== '' &&
            emailRegex.test(email) &&
            password.length >= 6 &&
            !errors.email &&
            !errors.password;
    };

    // Handle input changes with real-time validation
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        // Clear error when user starts typing
        if (errors.email && value.trim()) {
            setTimeout(() => validateField('email', value), 500); // Debounced validation
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

        // Clear error when user starts typing
        if (errors.password && value.trim()) {
            setTimeout(() => validateField('password', value), 500); // Debounced validation
        }
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        // Validate form before submission
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            await dispatch(loginUser({ email, password })).unwrap();
            toast.success('Login successful!');
        } catch (error: any) {
            toast.error(error?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (user) {
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate("/")
            }
        }
    }, [status, user, navigate]);

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

                {/* Right side with login form */}
                <div className="flex-1 flex flex-col justify-center items-center p-8">
                    <div className="w-full max-w-md">
                        <h1 className="text-5xl font-bold mb-2">Welcome</h1>
                        <p className="text-gray-400 mb-8">We are glad to see you back with us</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email field */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <User size={20} />
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

                            {/* Password field */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.password
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                        : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                                        }`}
                                    disabled={isSubmitting}
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1 ml-1">{errors.password}</p>
                                )}
                            </div>
                            <div className=" text-end">
                                <Link to="/forgot" className="text-white-400 hover:text-white-300 font-medium">
                                    <span className="text-gray-400">Forgot your password ?   </span>
                                </Link>
                            </div>

                            {/* Login button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full font-semibold py-4 rounded-lg transition-colors uppercase tracking-wider ${!isFormValid() || isSubmitting
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
                                        Logging in...
                                    </span>
                                ) : (
                                    <span className=' text-white'>Log in</span>
                                )}
                            </button>
                        </form>

                        {/* Sign up link */}
                        <div className="mt-6 text-center">
                            <span className="text-gray-400">Don't have an account ?   </span>
                            <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium">
                                Signup
                            </Link>
                        </div>

                        {/* Social login buttons */}
                        <AuthOButtons isSubmitting={isSubmitting} process='login' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

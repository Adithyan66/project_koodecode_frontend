import React, { useEffect, useState } from 'react';
import { User, Lock } from 'lucide-react';
import LoginHero from "../../assets/images/login_student-removebg-preview.png"
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser } from '../../features/auth/userThunks';

const LoginPage: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch()

    const navigate = useNavigate();

    // async function handleSubmit(e: React.FormEvent) {
    //     e.preventDefault();
    //     dispatch(loginUser({ email, password }));
    // }


    const { user, status } = useAppSelector(state => state.user);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    }

    // watch success state and navigate
    useEffect(() => {
        console.log(user)
        if (status == "succeeded" && user) {
            navigate('/problems');
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

                        <div className="space-y-6">
                            {/* Username field */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                />
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
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
                                />
                            </div>

                            {/* Next button */}
                            <button
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors uppercase tracking-wider"
                                onClick={handleSubmit}
                            >
                                Log in
                            </button>
                        </div>

                        {/* Sign up link */}
                        <div className="mt-6 text-center">
                            <span className="text-gray-400">don't have an account? </span>
                            <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium">
                                Signup
                            </Link>
                        </div>

                        {/* Social login buttons */}
                        <div className="mt-8 space-y-3">
                            {/* Google login */}
                            <button className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-3 px-4 flex items-center justify-center space-x-3 transition-colors">
                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-black">G</span>
                                </div>
                                <span className="text-white font-medium">Login with google</span>
                            </button>

                            {/* Facebook login */}
                            <button className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-3 px-4 flex items-center justify-center space-x-3 transition-colors">
                                <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                                    <span className="text-xs font-bold text-blue-600">f</span>
                                </div>
                                <span className="text-white font-medium">Login with Facebook</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
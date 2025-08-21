



import React, { useState, useRef, useEffect } from 'react';
import { Users, MessageSquare, Trophy, User, Settings, LogOut, HelpCircle } from 'lucide-react';
import homeHero from "../../assets/images/Homepage-BigHero-1200x500_2x.webp"
import Logo from "../../assets/images/Screenshot from 2025-08-02 10-50-58 1.svg"
import userIcon from "../../assets/images/Icon.svg"

import { Link } from "react-router-dom"
import Navbar from '../../components/user/Navbar';


const LandingPage: React.FC = () => {
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const modalRef = useRef<HTMLDivElement>(null);
    // const userIconRef = useRef<HTMLImageElement>(null);

    // // Close modal when clicking outside
    // useEffect(() => {
    //     const handleClickOutside = (event: MouseEvent) => {
    //         if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
    //             userIconRef.current && !userIconRef.current.contains(event.target as Node)) {
    //             setIsModalOpen(false);
    //         }
    //     };

    //     if (isModalOpen) {
    //         document.addEventListener('mousedown', handleClickOutside);
    //     }

    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, [isModalOpen]);

    // const toggleModal = () => {
    //     setIsModalOpen(!isModalOpen);
    // };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <section className="relative px-6 py-16 md:py-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Code Together,<br />
                                <span className="text-green-400">Build Faster</span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 max-w-lg">
                                Collaborate on code in real-time, with whiteboards and chat built-in.
                                Practice, build to live sessions when learning new topics.
                            </p>
                            <div className="flex space-x-4">
                                <button className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold text-black transition-colors">
                                    Create Room
                                </button>
                                <button className="border border-green-500 text-green-500 hover:bg-green-500 hover:text-black px-6 py-3 rounded-lg font-semibold transition-colors">
                                    Join Room
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="bg-white rounded-lg p-4 mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-orange-400 rounded-full"></div>
                                        <div className="w-10 h-10 bg-blue-400 rounded-full"></div>
                                        <div className="w-10 h-10 bg-pink-400 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4"></div>
                                    <div className="space-y-2">
                                        <div className="h-2 bg-white/30 rounded w-3/4 mx-auto"></div>
                                        <div className="h-2 bg-white/30 rounded w-1/2 mx-auto"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Background geometric pattern */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
                </div>
            </section>

            {/* Built for Students Section */}
            <section className="px-6 py-16 bg-black">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
                        BUILT FOR <span className="text-green-400">STUDENTS,</span>
                    </h2>

                    <div className="relative bg-black rounded-3xl p-8 overflow-hidden">

                        <img
                            src={homeHero}
                            alt="Student coding"
                        />
                    </div>
                </div>
            </section>

            {/* Join Rooms Section */}
            <section className="px-6 py-16 bg-black">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold mb-12">
                        Join <span className="text-green-400">Rooms</span> Now
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Room 1 */}
                        <div className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=200&fit=crop&crop=face"
                                    alt="User"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full">
                                    <span className="text-sm">JavaScript</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                                    Question No 276
                                </div>
                                <h3 className="text-xl font-bold mb-2">How to Solve this minimal Time complexity</h3>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Users size={16} />
                                    <span className="text-sm">5 participants</span>
                                </div>
                            </div>
                        </div>

                        {/* Room 2 */}
                        <div className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=200&fit=crop&crop=face"
                                    alt="User"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full">
                                    <span className="text-sm">Algorithm</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                                    Solutions Discuss
                                </div>
                                <h3 className="text-xl font-bold mb-2">How to Solve this in minimal time complexity</h3>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <MessageSquare size={16} />
                                    <span className="text-sm">12 solutions</span>
                                </div>
                            </div>
                        </div>

                        {/* Room 3 */}
                        <div className="bg-gray-800 rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
                            <div className="relative bg-gray-700 h-48 flex items-center justify-center">
                                <Trophy size={64} className="text-green-400" />
                                <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full">
                                    <span className="text-sm">Contest</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="bg-green-500 text-black px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                                    Question No 276
                                </div>
                                <h3 className="text-xl font-bold mb-2">Looking for teams to group work collaboration</h3>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Users size={16} />
                                    <span className="text-sm">8 teams</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="px-6 py-8 bg-black border-t border-gray-700">
                <div className="max-w-7xl mx-auto text-center text-gray-400">
                    <p>&copy; 2024 KodeCode. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
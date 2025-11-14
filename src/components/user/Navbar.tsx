

import { HelpCircle, LogOut, Settings, User, LogIn, UserPlus } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom';

import Logo from "../../assets/images/Screenshot from 2025-08-02 10-50-58 1.svg"
import { useAppDispatch, useAppSelector } from '../../app/hooks';

import { logoutUser } from "../../features/auth/userThunks"

const Navbar: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLButtonElement>(null);
    const location = useLocation();

    const profilePicUrl = useAppSelector(state => state.user.user?.profilePicUrl);
    const user = useAppSelector(state => state.user.user);

    const dispatch = useAppDispatch()

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node) &&
                userIconRef.current && !userIconRef.current.contains(event.target as Node)) {
                setIsModalOpen(false);
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleSupportClick = () => {
        setIsModalOpen(false);
        if (typeof window !== 'undefined') {
            window.location.href = 'mailto:koodecode@gmail.com';
        }
    };

    return (
        <nav className="flex items-center justify-between px-6 py-2 bg-black relative h-14">
            <div className="flex items-center space-x-2">
                <img src={Logo} alt="Logo" className="h-8" />
            </div>

            <div className="hidden md:flex items-center space-x-8">
                <Link
                    to="/"
                    className={`transition-colors ${isActive('/')
                            ? 'text-white font-semibold'
                            : 'text-gray-300 hover:text-white'
                        }`}
                >
                    Explore
                </Link>
                <Link
                    to="/problems"
                    className={`transition-colors ${isActive('/problems')
                            ? 'text-white font-semibold'
                            : 'text-gray-300 hover:text-white'
                        }`}
                >
                    Problems
                </Link>
                <Link
                    to="/contests"
                    className={`transition-colors ${isActive('/contests')
                            ? 'text-white font-semibold'
                            : 'text-gray-300 hover:text-white'
                        }`}
                >
                    Contest
                </Link>
                <Link
                    to="/store"
                    className={`transition-colors ${isActive('/store')
                            ? 'text-white font-semibold'
                            : 'text-gray-300 hover:text-white'
                        }`}
                >
                    Store
                </Link>
            </div>

            <div className="relative">
                <button
                    className="rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer"
                    onClick={toggleModal}
                    ref={userIconRef}
                >
                    {profilePicUrl ? (
                        <img
                            src={profilePicUrl}
                            alt="profile"
                            className="w-8 h-8 rounded-full object-cover bg-white p-0.5"
                        />
                    ) : (
                        <User size={32} className='p-1.5' />
                    )}
                </button>

                {/* Modal */}
                {isModalOpen && (
                    <div
                        ref={modalRef}
                        className="absolute right-0 top-13 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
                    >
                        {user ? (
                            // Authenticated user modal
                            <>
                                <div className="px-4 py-3 border-b border-gray-700">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                                            {user.profilePicUrl ? (
                                                <img
                                                    src={user.profilePicUrl}
                                                    alt="profile"
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                                    <User size={20} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">{user.fullName}</p>
                                            <p className="text-gray-400 text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="py-1">
                                    <Link
                                        to="/profile"
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <User size={18} />
                                        <span>Profile</span>
                                    </Link>
                                    <Link
                                        to="/settings"
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <Settings size={18} />
                                        <span>Settings</span>
                                    </Link>
                                    <button
                                        type="button"
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                                        onClick={handleSupportClick}
                                    >
                                        <HelpCircle size={18} />
                                        <span>Help & Support</span>
                                    </button>
                                </div>

                                <div className="border-t border-gray-700 pt-1">
                                    <button
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                                        onClick={() => {
                                            dispatch(logoutUser())
                                            setIsModalOpen(false);
                                        }}
                                    >
                                        <LogOut size={18} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            // Guest user modal
                            <>
                                <div className="py-1">
                                    <Link
                                        to="/login"
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <LogIn size={18} />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <UserPlus size={18} />
                                        <span>Sign Up</span>
                                    </Link>
                                </div>

                                <div className="border-t border-gray-700 pt-1">
                                    <Link
                                        to="/settings"
                                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        <Settings size={18} />
                                        <span>Settings</span>
                                    </Link>
                                    <button
                                        type="button"
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-left"
                                        onClick={handleSupportClick}
                                    >
                                        <HelpCircle size={18} />
                                        <span>Help & Support</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar












  
import { HelpCircle, LogOut, Settings, User } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';

import Logo from "../../assets/images/Screenshot from 2025-08-02 10-50-58 1.svg"



const Navbar: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const userIconRef = useRef<HTMLButtonElement>(null);

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


    return (
        <nav className="flex items-center justify-between px-6  bg-black relative">
            <div className="flex items-center space-x-2">
                <img src={Logo}></img>
            </div>

            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Explore</Link>
                <Link to="/problems" className="text-gray-300 hover:text-white transition-colors">Problems</Link>
                <Link to="#" className="text-gray-300 hover:text-white transition-colors">Contest</Link>
                <Link to="#" className="text-gray-300 hover:text-white transition-colors">Coins</Link>
            </div>

            <div className="relative">

                <button
                    className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
                    onClick={toggleModal}
                    ref={userIconRef}
                >
                    <User size={20} />
                </button>

                {/* Modal */}
                {isModalOpen && (
                    <div
                        ref={modalRef}
                        className="absolute right-0 top-12 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50"
                    >
                        <div className="px-4 py-3 border-b border-gray-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <User size={20} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-medium">John Doe</p>
                                    <p className="text-gray-400 text-sm">john@example.com</p>
                                </div>
                            </div>
                        </div>

                        <div className="py-1">
                            <Link to="/login" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                <User size={18} />
                                <span>Profile</span>
                            </Link>
                            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                <Settings size={18} />
                                <span>Settings</span>
                            </a>
                            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                <HelpCircle size={18} />
                                <span>Help & Support</span>
                            </a>
                        </div>

                        <div className="border-t border-gray-700 pt-1">
                            <a href="#" className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors">
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar
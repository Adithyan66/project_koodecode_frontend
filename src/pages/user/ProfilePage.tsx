





import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import Navbar from '../../components/user/Navbar';

interface UserProfile {
    username: string;
    name: string;
    email: string;
    avatar: string;
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const user = useAppSelector(state => state.user.user);
    console.log("from profile", user);

    useEffect(() => {
        if (user) {
            setProfile({
                username: user.userName,
                name: user.fullName,
                email: user.email,
                avatar: user.profilePicUrl || 'https://img.favpng.com/20/12/23/3d-male-avatar-3d-male-character-in-yellow-shirt-1yYSh8Ju_t.jpg'
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-400">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-gray-400">No user data available</div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-black">
                <div className="max-w-10xl mx-auto px-4 py-12">
                    <div className="grid  gap-8">
                        {/* Left Side - Profile Info */}
                        <div className="bg-gray-800 rounded-lg shadow p-8 w-[300px]">
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={profile.avatar}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-gray-600 mb-6"
                                />

                                <div className="space-y-4 w-full">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                        <div className="text-lg font-semibold text-white">{profile.name}</div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                                        <div className="text-lg text-gray-300">@{profile.username}</div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                        <div className="text-lg text-gray-300">{profile.email}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                      
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
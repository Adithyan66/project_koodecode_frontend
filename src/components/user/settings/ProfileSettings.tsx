





import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera, Save, Upload } from 'lucide-react';
import httpClient from '../../../services/axios/httpClient';
import { toast } from 'react-toastify';
import { ImageUploadService } from '../../../services/ImageUploadService';
import { imageKitService } from '../../../services/ImageKitService';

const ProfileSettings: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        fullname:"",
        email: '',
        bio: '',
        location: '',
        birthdate: '',
        gender: '' as 'male' | 'female' | 'other' | '',
        githubUrl: '',
        linkedinUrl: '',
        profileImageKey: '', // S3 key for ImageKit
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        console.log(name,value);
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Upload to S3 and get the key
            const imageKey = await ImageUploadService.uploadProfileImage(file, (progress) => {
                setUploadProgress(progress);
            });

            // Generate optimized ImageKit URL for display
            const optimizedUrl = imageKitService.getProfileImageUrl(imageKey,100,100, {radius:"max"});
            
            // Update local state
            setProfileImage(optimizedUrl);
            setFormData(prev => ({
                ...prev,
                profileImageKey: imageKey
            }));

            toast.success('Profile image uploaded successfully!');

            console.log("Profile image uploaded successfully");
            

        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error(error.message || 'Failed to upload image');

        } finally {

            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            console.log('Saving profile data:', formData);
            
            let response = await httpClient.put(`/user/profile`, formData);

            if (response.data.success) {
                toast.success("Profile updated successfully!");
            }

        } catch (error) {
            toast.error("Failed to update profile");
            console.error('Failed to save profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    async function fetchProfileData() {
        setIsLoading(true);
        try {
            const response = await httpClient.get(`/user/profile`);
            if (response.data.success) {
                const profileData = response.data.data;
                setFormData(profileData);
                
                // If user has a profile image, generate optimized URL
                if (profileData.profileImageKey) {
                    const optimizedUrl = imageKitService.getProfileImageUrl(profileData.profileImageKey,100,100, {radius:"max"});
                    setProfileImage(optimizedUrl);
                    console.log("optimizedUrl",optimizedUrl);
                    
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchProfileData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>

                {/* Profile Picture */}
                <div className="flex items-center space-x-6 mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                            {profileImage ? (
                                <img 
                                    src={profileImage} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover" 
                                />
                            ) : (
                                <span className="text-2xl text-gray-500">👤</span>
                            )}
                            
                            {/* Upload Progress Overlay */}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-full">
                                    <div className="text-white text-xs font-semibold">
                                        {uploadProgress}%
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <label 
                            htmlFor="profile-image" 
                            className={`absolute -bottom-1 -right-1 text-white rounded-full p-1 cursor-pointer transition-colors ${
                                isUploading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            {isUploading ? (
                                <Upload size={14} className="animate-pulse" />
                            ) : (
                                <Camera size={14} />
                            )}
                        </label>
                        
                        <input
                            id="profile-image"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploading}
                        />
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">Profile Picture</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isUploading 
                                ? `Uploading... ${uploadProgress}%` 
                                : 'JPEG, PNG, WebP up to 5MB'
                            }
                        </p>
                        {formData.profileImageKey && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                ✓ Image optimized and ready
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Username *
                        </label>
                        <input
                            type="text"
                            name="username"
                            disabled
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Fullname *
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your fullname"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            disabled
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="Enter your location"
                        />
                    </div>

                    {/* Birthdate */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Birthdate
                        </label>
                        <input
                            type="date"
                            name="birthdate"
                            value={(formData.birthdate ? formData.birthdate.split("T")[0] : "")}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* GitHub URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="https://github.com/username"
                        />
                    </div>

                    {/* LinkedIn URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                {/* Save Button */}
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || isUploading}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save size={16} />
                        <span>
                            {isLoading ? 'Saving...' : 
                             isUploading ? 'Uploading...' : 
                             'Save Changes'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;

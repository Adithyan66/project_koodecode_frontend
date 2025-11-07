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
        fullname: "",
        email: '',
        bio: '',
        location: '',
        birthdate: '',
        gender: '' as 'male' | 'female' | 'other' | '',
        githubUrl: '',
        linkedinUrl: '',
        profileImageKey: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

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
            const imageKey = await ImageUploadService.uploadProfileImage(file, (progress) => {
                setUploadProgress(progress);
            });

            const optimizedUrl = imageKitService.getProfileImageUrl(imageKey, 100, 100, { radius: "max" });

            setProfileImage(optimizedUrl);
            setFormData(prev => ({
                ...prev,
                profileImageKey: imageKey
            }));

            toast.success('Profile image uploaded successfully!');
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

            const response = await httpClient.put(`/user/profile`, formData);

            if (response.data.success) {
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            toast.error('Failed to update profile');
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

                if (profileData.profileImageKey) {
                    const optimizedUrl = imageKitService.getProfileImageUrl(profileData.profileImageKey, 100, 100, { radius: "max" });
                    setProfileImage(optimizedUrl);
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
        <div className="space-y-6 text-gray-200">
            <div className="rounded-3xl border border-white/10 bg-black/65 p-6 shadow-[0_20px_45px_rgba(15,15,15,0.35)] backdrop-blur">
                <h2 className="mb-6 text-xl font-semibold text-white">Profile Information</h2>

                <div className="mb-6 flex items-center space-x-6">
                    <div className="relative">
                        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-black/50">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl text-gray-500">👤</span>
                            )}

                            {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/70">
                                    <div className="text-xs font-semibold text-white">
                                        {uploadProgress}%
                                    </div>
                                </div>
                            )}
                        </div>

                        <label
                            htmlFor="profile-image"
                            className={`absolute -bottom-1 -right-1 cursor-pointer rounded-full border border-white/30 p-1 text-white transition ${
                                isUploading
                                    ? 'bg-white/10 cursor-not-allowed border-white/10'
                                    : 'bg-white/10 hover:border-white/50 hover:bg-white/20'
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
                        <h3 className="font-medium text-white">Profile Picture</h3>
                        <p className="text-sm text-gray-400">
                            {isUploading
                                ? `Uploading... ${uploadProgress}%`
                                : 'JPEG, PNG, WebP up to 5MB'}
                        </p>
                        {formData.profileImageKey && (
                            <p className="mt-1 text-xs text-gray-300">
                                ✓ Image optimized and ready
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Username *
                        </label>
                        <input
                            type="text"
                            name="username"
                            disabled
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none disabled:cursor-not-allowed"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Fullname *
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                            placeholder="Enter your fullname"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            disabled
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none disabled:cursor-not-allowed"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                            placeholder="Enter your location"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Birthdate
                        </label>
                        <input
                            type="date"
                            name="birthdate"
                            value={(formData.birthdate ? formData.birthdate.split('T')[0] : '')}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            GitHub URL
                        </label>
                        <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                            placeholder="https://github.com/username"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                            LinkedIn URL
                        </label>
                        <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleInputChange}
                            className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="mb-2 block text-sm font-medium text-white">
                        Bio
                    </label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-2 text-gray-200 shadow-sm focus:border-white/40 focus:outline-none"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={isLoading || isUploading}
                        className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-white transition hover:border-white/40 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Save size={16} />
                        <span>
                            {isLoading ? 'Saving...'
                                : isUploading ? 'Uploading...'
                                : 'Save Changes'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;

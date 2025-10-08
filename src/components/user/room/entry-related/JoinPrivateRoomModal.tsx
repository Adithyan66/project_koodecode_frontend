




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react';
import httpClient from '../../../../services/axios/httpClient';

interface JoinPrivateRoomModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const JoinPrivateRoomModal: React.FC<JoinPrivateRoomModalProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        roomName: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        roomName: '',
        password: '',
        general: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleClose = () => {
        if (isSubmitting) return;
        setFormData({ roomName: '', password: '' });
        setErrors({ roomName: '', password: '', general: '' });
        setShowPassword(false);
        onClose();
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear field-specific error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        // Clear general error when user makes any change
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {
            roomName: '',
            password: '',
            general: ''
        };

        if (!formData.roomName.trim()) {
            newErrors.roomName = 'Room name is required';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return !newErrors.roomName && !newErrors.password;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {

            const response = await httpClient.post(`/user/rooms/verify-private`, {
                roomName: formData.roomName.trim(),
                password: formData.password
            })

            let { data } = response

            if (data.success) {

                navigate(`/room/${data.roomId}`, { state: { password: formData.password } });
                handleClose();
            } else {
                // Handle specific error cases
                if (data.error.toLowerCase().includes('room not found') || data.error.toLowerCase().includes('room name')) {
                    setErrors(prev => ({ ...prev, roomName: 'Room not found' }));
                } else if (data.error.toLowerCase().includes('password') || data.error.toLowerCase().includes('invalid')) {
                    setErrors(prev => ({ ...prev, password: 'Invalid password' }));
                } else {
                    setErrors(prev => ({ ...prev, general: data.error }));
                }
            }
        } catch (error) {
            let {data} = error.response
            if (data.error.toLowerCase().includes('room not found') || data.error.toLowerCase().includes('room name')) {
                    setErrors(prev => ({ ...prev, roomName: 'Room not found' }));
                } else if (data.error.toLowerCase().includes('password') || data.error.toLowerCase().includes('invalid')) {
                    setErrors(prev => ({ ...prev, password: 'Invalid password' }));
                } else {
                    setErrors(prev => ({ ...prev, general: data.error }));
                }
            console.error('Error joining private room:', error);
            setErrors(prev => ({ ...prev, general: 'Failed to join room. Please try again.' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget && !isSubmitting) {
                    handleClose();
                }
            }}
        >
            <div
                className="bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl no-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Join Private Room</h2>
                            <p className="text-gray-400 text-sm">
                                Enter room credentials to join the collaboration
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg disabled:opacity-50"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* General Error Display */}
                    {errors.general && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                            <div className="flex items-center space-x-2 text-red-400">
                                <AlertCircle size={18} />
                                <p className="text-sm font-medium">{errors.general}</p>
                            </div>
                        </div>
                    )}

                    {/* Room Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white">
                            Room Name *
                        </label>
                        <input
                            type="text"
                            value={formData.roomName}
                            onChange={(e) => handleInputChange('roomName', e.target.value)}
                            placeholder="Enter the private room name..."
                            disabled={isSubmitting}
                            className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 ${errors.roomName ? 'border-red-500' : 'border-gray-600'
                                }`}
                        />
                        {errors.roomName && (
                            <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
                                <AlertCircle size={12} />
                                <span>{errors.roomName}</span>
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-semibold text-white">
                            Room Password *
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                placeholder="Enter the room password..."
                                disabled={isSubmitting}
                                className={`w-full px-4 py-3 pr-12 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 ${errors.password ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
                                <AlertCircle size={12} />
                                <span>{errors.password}</span>
                            </p>
                        )}
                    </div>

                    {/* Private Room Info */}
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center space-x-3">
                            <Lock size={20} className="text-red-400" />
                            <div>
                                <p className="text-white font-semibold">Private Room Access</p>
                                <p className="text-gray-400 text-sm">
                                    Only users with correct credentials can join
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-xl transition-all font-semibold flex items-center justify-center space-x-2 shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader className="animate-spin" size={18} />
                                    <span>Joining Room...</span>
                                </>
                            ) : (
                                <span>Join Room</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinPrivateRoomModal;

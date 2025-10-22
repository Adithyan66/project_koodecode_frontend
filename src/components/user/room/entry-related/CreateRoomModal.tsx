

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Upload,
  Calendar,
  Clock,
  Lock,
  Users,
  Code,
  PenTool,
  Eye,
  EyeOff,
  Loader,
  AlertCircle,
  Video,
  MessageCircle,
  Edit3
} from 'lucide-react';
import httpClient from '../../../../services/axios/httpClient';
import { ImageUploadService } from '../../../../services/ImageUploadService';
import ProblemSelectorForModal from './ProblemSelectorForModal';
import { toast } from 'react-toastify';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Problem {
  problemNumber: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface CreateRoomData {
  name: string;
  description: string;
  isPrivate: boolean;
  password?: string;
  problemNumber?: number;
  thumbnail?: string;
  scheduledTime?: string;
  isInstant: boolean;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose }) => {


  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreateRoomData>({
    name: '',
    description: '',
    isPrivate: false,
    password: '',
    isInstant: true,
  });

  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showProblemSelector, setShowProblemSelector] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Validation states
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    password: '',
    scheduledTime: ''
  });

  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      description: '',
      password: '',
      scheduledTime: ''
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Room name must be at least 3 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Room name must not exceed 50 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    // Password validation for private rooms
    if (formData.isPrivate && !formData.password?.trim()) {
      newErrors.password = 'Password is required for private rooms';
    }

    // Scheduled time validation
    if (!formData.isInstant) {
      if (!scheduledDateTime) {
        newErrors.scheduledTime = 'Scheduled time is required';
      } else if (new Date(scheduledDateTime) <= new Date()) {
        newErrors.scheduledTime = 'Scheduled time must be in the future';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleInputChange = (field: keyof CreateRoomData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear specific error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    setError('');
  };

  const handleThumbnailSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string);
      setThumbnailFile(file);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const uploadThumbnail = async (): Promise<string | null> => {
    if (!thumbnailFile) return null;

    setIsUploading(true);
    try {
      // const uploadService = new ImageUploadService();
      const imageUrl = await ImageUploadService.uploadRoomThumbnail(thumbnailFile, (progress) => {
        setUploadProgress(progress);
      });
      return imageUrl;
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      setError('Failed to upload thumbnail. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowProblemSelector(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Upload thumbnail if selected
      let thumbnailUrl = '';
      if (thumbnailFile) {
        const uploadedUrl = await uploadThumbnail();
        if (!uploadedUrl) {
          setIsSubmitting(false);
          return;
        }
        thumbnailUrl = uploadedUrl;
      }

      // Prepare room data
      const roomData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isPrivate: formData.isPrivate,
        password: formData.isPrivate ? formData.password : undefined,
        problemNumber: selectedProblem?.problemNumber,
        thumbnail: thumbnailUrl,
        scheduledTime: formData.isInstant ? undefined : scheduledDateTime,
      };

      // Create room
      const response = await httpClient.post('/user/rooms/create', roomData);

      if (response.data.success) {
        const { data } = response.data;
        // Close modal and reset form
        handleClose();
        console.log("is isnstalntttttt", data);

        // Navigate based on room type
        if (formData.isInstant) {
          navigate(`/room/${data.id}`);
        } else {
          // For scheduled rooms, show success message and stay on landing page
          console.log('Room scheduled successfully!');
          toast.success('Room scheduled successfully!');
        }
      } else {
        setError(response.data.error || 'Failed to create room');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to create room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isPrivate: false,
      password: '',
      isInstant: true,
    });
    setSelectedProblem(null);
    setThumbnailPreview('');
    setThumbnailFile(null);
    setScheduledDateTime('');
    setShowProblemSelector(false);
    setErrors({
      name: '',
      description: '',
      password: '',
      scheduledTime: ''
    });
    setError('');
    setShowPassword(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500 bg-green-500/10';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'Hard': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  // Get minimum date time (current time + 5 minutes)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 "
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Create Your Room</h2>
              <p className="text-gray-400 text-sm">
                Set up your collaborative coding space with real-time features
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
          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle size={18} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Room Type Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">Room Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleInputChange('isInstant', true)}
                disabled={isSubmitting}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${formData.isInstant
                    ? 'border-green-500 bg-green-500/10 text-green-400 shadow-lg'
                    : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Clock size={24} />
                  <div>
                    <p className="font-semibold">Instant Room</p>
                    <p className="text-xs opacity-75">Start coding immediately</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleInputChange('isInstant', false)}
                disabled={isSubmitting}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${!formData.isInstant
                    ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg'
                    : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                  }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Calendar size={24} />
                  <div>
                    <p className="font-semibold">Scheduled Room</p>
                    <p className="text-xs opacity-75">Plan for later</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Scheduled Time Input */}
          {!formData.isInstant && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-white">
                Scheduled Time *
              </label>
              <input
                type="datetime-local"
                min={getMinDateTime()}
                value={scheduledDateTime}
                onChange={(e) => {
                  setScheduledDateTime(e.target.value);
                  if (errors.scheduledTime) {
                    setErrors(prev => ({ ...prev, scheduledTime: '' }));
                  }
                }}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 ${errors.scheduledTime ? 'border-red-500' : 'border-gray-600'
                  }`}
              />
              {errors.scheduledTime && (
                <p className="text-red-400 text-xs mt-1 flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>{errors.scheduledTime}</span>
                </p>
              )}
            </div>
          )}

          {/* Room Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Room Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter an engaging room name..."
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 ${errors.name ? 'border-red-500' : 'border-gray-600'
                }`}
            />
            <div className="flex justify-between items-center">
              {errors.name && (
                <p className="text-red-400 text-xs flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>{errors.name}</span>
                </p>
              )}
              <p className={`text-xs ml-auto ${formData.name.length > 50 ? 'text-red-400' : 'text-gray-500'
                }`}>
                {formData.name.length}/50
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-white">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what you'll be working on, learning goals, or collaboration style..."
              rows={4}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors resize-none disabled:opacity-50 ${errors.description ? 'border-red-500' : 'border-gray-600'
                }`}
            />
            <div className="flex justify-between items-center">
              {errors.description && (
                <p className="text-red-400 text-xs flex items-center space-x-1">
                  <AlertCircle size={12} />
                  <span>{errors.description}</span>
                </p>
              )}
              <p className={`text-xs ml-auto ${formData.description.length > 500 ? 'text-red-400' : 'text-gray-500'
                }`}>
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="flex items-center space-x-3">
                {formData.isPrivate ? <Lock size={20} className="text-red-400" /> : <Users size={20} className="text-green-400" />}
                <div>
                  <p className="text-white font-semibold">
                    {formData.isPrivate ? 'Private Room' : 'Public Room'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formData.isPrivate
                      ? 'Requires password to join'
                      : 'Anyone can discover and join'
                    }
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPrivate}
                  onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                  disabled={isSubmitting}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 peer-disabled:opacity-50"></div>
              </label>
            </div>

            {/* Password Input */}
            {formData.isPrivate && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white">
                  Room Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Set a password for your private room..."
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
            )}
          </div>

          {/* Problem Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">
              Starter Problem (Optional)
            </label>
            <div className="relative">
              {selectedProblem ? (
                <div className="p-4 bg-gray-800/50 border border-green-500/30 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-semibold">
                          #{selectedProblem.problemNumber}
                        </span>
                        <span className="text-white font-medium">{selectedProblem.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(selectedProblem.difficulty)}`}>
                        {selectedProblem.difficulty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedProblem(null)}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-red-400 transition-colors p-1 hover:bg-gray-700 rounded disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowProblemSelector(!showProblemSelector)}
                  disabled={isSubmitting}
                  className="w-full p-4 bg-gray-800 border border-gray-600 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Code size={20} />
                  <span>Select a problem to work on</span>
                </button>
              )}

              {showProblemSelector && !selectedProblem && (
                <ProblemSelectorForModal
                  onSelectProblem={handleProblemSelect}
                  onClose={() => setShowProblemSelector(false)}
                />
              )}
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-white">
              Room Thumbnail (Optional)
            </label>
            <div className="space-y-3">
              {thumbnailPreview ? (
                <div className="relative group">
                  <img
                    src={thumbnailPreview}
                    alt="Room thumbnail"
                    className="w-full h-40 object-cover rounded-xl border border-gray-600"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnailPreview('');
                        setThumbnailFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      disabled={isSubmitting}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium disabled:opacity-50"
                    >
                      <X size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                  className={`w-full h-40 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center transition-colors ${isSubmitting
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:border-gray-500 hover:bg-gray-800/30'
                    }`}
                >
                  <Upload size={32} className="text-gray-400 mb-3" />
                  <p className="text-gray-400 text-sm mb-1 font-medium">Click to upload thumbnail</p>
                  <p className="text-gray-500 text-xs">PNG, JPG, WebP up to 5MB • Recommended: 1280x720px</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                disabled={isSubmitting}
                className="hidden"
              />
            </div>

            {/* {isUploading && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-full">
                <div className="text-white text-xs font-semibold">
                  {uploadProgress}%
                </div>
              </div>
            )} */}
          </div>

          {/* Features Info */}
          <div className="bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-green-500/20">
            <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <PenTool size={20} className="text-green-400" />
              <span>Your room will include:</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-1 bg-green-500/20 rounded-full">
                  <Edit3 size={14} className="text-green-400" />
                </div>
                <span>Real-time code collaboration</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-1 bg-blue-500/20 rounded-full">
                  <PenTool size={14} className="text-blue-400" />
                </div>
                <span>Interactive whiteboard</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-1 bg-purple-500/20 rounded-full">
                  <Video size={14} className="text-purple-400" />
                </div>
                <span>HD video & voice chat</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-1 bg-yellow-500/20 rounded-full">
                  <Users size={14} className="text-yellow-400" />
                </div>
                <span>Member permissions control</span>
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
              disabled={isSubmitting || isUploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-black rounded-xl transition-all font-semibold flex items-center justify-center space-x-2 shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={18} />
                   {uploadProgress}%
                  <span>Creating Room...</span>
                </>
              ) : (
                <span>
                  {formData.isInstant ? 'Create & Join Room' : 'Schedule Room'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;

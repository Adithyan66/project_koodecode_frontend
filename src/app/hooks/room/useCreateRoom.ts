import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import httpClient from '../../../services/axios/httpClient';
import { ImageUploadService } from '../../../services/ImageUploadService';

export interface Problem {
  problemNumber: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface CreateRoomData {
  name: string;
  description: string;
  isPrivate: boolean;
  password?: string;
  problemNumber?: number;
  thumbnail?: string;
  scheduledTime?: string;
  isInstant: boolean;
}

interface UseCreateRoomProps {
  onClose: () => void;
}

export const useCreateRoom = ({ onClose }: UseCreateRoomProps) => {
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
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [errors, setErrors] = useState({
    name: '',
    description: '',
    password: '',
    scheduledTime: ''
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      password: '',
      scheduledTime: ''
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Room name must be at least 3 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Room name must not exceed 50 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    if (formData.isPrivate && !formData.password?.trim()) {
      newErrors.password = 'Password is required for private rooms';
    }

    if (!formData.isInstant) {
      if (!scheduledDateTime) {
        newErrors.scheduledTime = 'Scheduled time is required';
      } else if (new Date(scheduledDateTime) <= new Date()) {
        newErrors.scheduledTime = 'Scheduled time must be in the future';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(currentError => currentError !== '');
  };

  const handleInputChange = (field: keyof CreateRoomData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    setError('');
  };

  const handleThumbnailSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, JPEG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = e => {
      setThumbnailPreview(e.target?.result as string);
      setThumbnailFile(file);
      setError('');
    };
    reader.readAsDataURL(file);
  };

  const uploadThumbnail = async () => {
    if (!thumbnailFile) return '';

    setIsUploading(true);
    try {
      const imageUrl = await ImageUploadService.uploadRoomThumbnail(thumbnailFile);
      return imageUrl;
    } catch (uploadError) {
      console.error('Failed to upload thumbnail:', uploadError);
      setError('Failed to upload thumbnail. Please try again.');
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  const handleProblemSelect = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowProblemSelector(false);
  };

  const clearSelectedProblem = () => {
    setSelectedProblem(null);
  };

  const handleScheduledTimeChange = (value: string) => {
    setScheduledDateTime(value);
    if (errors.scheduledTime) {
      setErrors(prev => ({ ...prev, scheduledTime: '' }));
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let thumbnailUrl = '';
      if (thumbnailFile) {
        thumbnailUrl = await uploadThumbnail();
        if (!thumbnailUrl) {
          setIsSubmitting(false);
          return;
        }
      }

      const roomData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isPrivate: formData.isPrivate,
        password: formData.isPrivate ? formData.password : undefined,
        problemNumber: selectedProblem?.problemNumber,
        thumbnail: thumbnailUrl,
        scheduledTime: formData.isInstant ? undefined : scheduledDateTime,
      };

      const response = await httpClient.post('/user/rooms/create', roomData);

      if (response.data.success) {
        const { data } = response.data;
        handleClose();

        if (formData.isInstant) {
          navigate(`/room/${data.id}`);
        } else {
          toast.success('Room scheduled successfully!');
        }
      } else {
        setError(response.data.error || 'Failed to create room');
      }
    } catch (submitError: any) {
      setError(submitError.response?.data?.error || 'Failed to create room. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleProblemSelector = () => {
    setShowProblemSelector(prev => !prev);
  };

  const closeProblemSelector = () => {
    setShowProblemSelector(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleRemoveThumbnail = () => {
    setThumbnailPreview('');
    setThumbnailFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500 bg-green-500/10';
      case 'Medium':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'Hard':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    return now.toISOString().slice(0, 16);
  };

  return {
    fileInputRef,
    formData,
    errors,
    error,
    selectedProblem,
    showProblemSelector,
    thumbnailPreview,
    isUploading,
    isSubmitting,
    scheduledDateTime,
    showPassword,
    handleInputChange,
    handleThumbnailSelect,
    handleProblemSelect,
    handleSubmit,
    handleClose,
    getDifficultyColor,
    getMinDateTime,
    toggleProblemSelector,
    closeProblemSelector,
    toggleShowPassword,
    handleScheduledTimeChange,
    handleRemoveThumbnail,
    clearSelectedProblem,
  };
};

export type UseCreateRoomReturn = ReturnType<typeof useCreateRoom>;


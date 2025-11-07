import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import httpClient from '../../../services/axios/httpClient';

interface JoinPrivateRoomFormData {
  roomName: string;
  password: string;
}

interface JoinPrivateRoomErrors {
  roomName: string;
  password: string;
  general: string;
}

interface UseJoinPrivateRoomProps {
  onClose: () => void;
}

export const useJoinPrivateRoom = ({ onClose }: UseJoinPrivateRoomProps) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<JoinPrivateRoomFormData>({
    roomName: '',
    password: ''
  });
  const [errors, setErrors] = useState<JoinPrivateRoomErrors>({
    roomName: '',
    password: '',
    general: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetState = () => {
    setFormData({ roomName: '', password: '' });
    setErrors({ roomName: '', password: '', general: '' });
    setShowPassword(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetState();
    onClose();
  };

  const handleInputChange = (field: keyof JoinPrivateRoomFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: JoinPrivateRoomErrors = {
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

  const applyApiErrors = (message?: string) => {
    if (!message) {
      setErrors(prev => ({ ...prev, general: 'Failed to join room. Please try again.' }));
      return;
    }

    const normalized = message.toLowerCase();

    if (normalized.includes('room not found') || normalized.includes('room name')) {
      setErrors(prev => ({ ...prev, roomName: 'Room not found' }));
    } else if (normalized.includes('password') || normalized.includes('invalid')) {
      setErrors(prev => ({ ...prev, password: 'Invalid password' }));
    } else {
      setErrors(prev => ({ ...prev, general: message }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await httpClient.post('/user/rooms/verify-private', {
        roomName: formData.roomName.trim(),
        password: formData.password
      });

      const { data } = response;

      if (data.success) {
        navigate(`/room/${data.data}`, { state: { password: formData.password } });
        handleClose();
      } else {
        const errorMessage = data.data?.error ?? data.error;
        applyApiErrors(errorMessage);
      }
    } catch (submitError: any) {
      const apiError = submitError?.response?.data;
      const errorMessage = apiError?.data?.error ?? apiError?.error;
      applyApiErrors(errorMessage);
      console.error('Error joining private room:', submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  return {
    formData,
    errors,
    showPassword,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    handleClose,
    toggleShowPassword,
  };
};

export type UseJoinPrivateRoomReturn = ReturnType<typeof useJoinPrivateRoom>;


import { type KeyboardEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { signupUser } from '../../../features/auth/userThunks';
import { authAPI } from '../../../services/axios/auth/authService';

type BackendPayload = {
    success?: boolean;
    message?: string;
    error?: string;
    [key: string]: unknown;
};

const getPayload = (response: unknown): BackendPayload => {
    if (!response || typeof response !== 'object') {
        return {};
    }

    const payload = response as Record<string, unknown>;

    if ('data' in payload && payload.data && typeof payload.data === 'object') {
        return payload.data as BackendPayload;
    }

    return payload as BackendPayload;
};

const getBackendMessage = (payload: BackendPayload | undefined, fallback: string) => {
    return payload?.message || payload?.error || fallback;
};

const isSuccessResponse = (payload?: BackendPayload) => {
    return payload?.success !== false;
};

const extractErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        return getBackendMessage(getPayload(error.response), fallback);
    }

    if (typeof error === 'string') {
        return error;
    }

    if (error && typeof error === 'object') {
        return getBackendMessage(error as BackendPayload, fallback);
    }

    return fallback;
};

type UseSignupReturn = {
    confirmPassword: string;
    createAccount: () => Promise<void>;
    email: string;
    handleKeyDown: (index: number, event: KeyboardEvent<HTMLInputElement>) => void;
    handleOtpChange: (index: number, value: string) => void;
    isLoading: boolean;
    name: string;
    otp: string[];
    otpPage: boolean;
    password: string;
    requestOtp: () => Promise<void>;
    resetOtp: () => void;
    setConfirmPassword: (value: string) => void;
    setEmail: (value: string) => void;
    setName: (value: string) => void;
    setPassword: (value: string) => void;
    setUsername: (value: string) => void;
    showPasswordSection: boolean;
    timeLeft: number;
    username: string;
    validateEmail: (value: string) => boolean;
    validateName: (value: string) => boolean;
    validatePassword: (value: string) => boolean;
    validateUsername: (value: string) => boolean;
};

export const useSignup = (): UseSignupReturn => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [otpPage, setOtpPage] = useState(false);
    const [otp, setOtp] = useState<string[]>(Array(5).fill(''));
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { user, status, error } = useAppSelector(state => state.user);
    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true);

    useEffect(() => {
        const timer = setTimeout(() => setShowPasswordSection(true), 5000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(error);
        }
    }, [error, status]);

    useEffect(() => {
        if (!user) {
            return;
        }

        if (isAdmin) {
            navigate('/admin/dashboard');
            return;
        }

        navigate('/');
    }, [isAdmin, navigate, user]);

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validateName = (value: string) => {
        return value.trim().length >= 2;
    };

    const validateUsername = (value: string) => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(value);
    };

    const validatePassword = (value: string) => {
        return value.length >= 6;
    };

    const validateInitialForm = () => {
        if (!validateName(name)) {
            toast.error('Name must be at least 2 characters long');
            return false;
        }

        if (!validateUsername(username)) {
            toast.error('Username must be 3-20 characters long and contain only letters, numbers, and underscores');
            return false;
        }

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const validatePasswordForm = () => {
        if (!validatePassword(password)) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }

        return true;
    };

    const validateOtp = () => {
        const otpValue = otp.join('');

        if (otpValue.length !== 5) {
            toast.error('Please enter the complete 5-digit OTP', { toastId: 'otp-incomplete' });
            return false;
        }

        if (!/^\d+$/.test(otpValue)) {
            toast.error('OTP must contain only numbers');
            return false;
        }

        return true;
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1 || !/^\d*$/.test(value)) {
            return;
        }

        setOtp(prev => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });

        if (value && index < 4) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Backspace' || otp[index] || index === 0) {
            return;
        }

        const previousInput = document.getElementById(`otp-${index - 1}`);
        previousInput?.focus();
    };

    const requestOtp = async () => {
        if (!validateInitialForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = getPayload(await authAPI.signUpOtp(email, username, name));
            const message = getBackendMessage(response, 'OTP sent to your email successfully!');

            if (!isSuccessResponse(response)) {
                toast.error(message);
                return;
            }

            setTimeLeft(59);
            setOtpPage(true);
            toast.success(message);
        } catch (error) {
            toast.error(extractErrorMessage(error, 'Failed to send OTP. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    const createAccount = async () => {
        if (!validateOtp() || !validatePasswordForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await dispatch(
                signupUser({
                    email,
                    password: confirmPassword,
                    otp: Number(otp.join(''))
                })
            ).unwrap();

            toast.success('Account created successfully!');
        } catch (error_) {
            toast.error(extractErrorMessage(error_, 'Failed to create account. Please try again.'));
        } finally {
            setIsLoading(false);
        }
    };

    const resetOtp = () => {
        setOtp(Array(5).fill(''));
    };

    return {
        confirmPassword,
        createAccount,
        email,
        handleKeyDown,
        handleOtpChange,
        isLoading,
        name,
        otp,
        otpPage,
        password,
        requestOtp,
        resetOtp,
        setConfirmPassword,
        setEmail,
        setName,
        setPassword,
        setUsername,
        showPasswordSection,
        timeLeft,
        username,
        validateEmail,
        validateName,
        validatePassword,
        validateUsername
    };
};



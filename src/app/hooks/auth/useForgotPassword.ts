import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI } from '../../../services/axios/auth/authService';
import { forgotPassword } from '../../../features/auth/userThunks';
import { useAppDispatch, useAppSelector } from '../../hooks';

export const useForgotPassword = () => {
    // States for different steps
    const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isLoading, setIsLoading] = useState(false);
    const [enablePassword, setEnablePassword] = useState(true);
    const [otpDisable, setOtpDisable] = useState(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, status } = useAppSelector(state => state.user);
    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true);

    const [errors, setErrors] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        let interval: number | undefined;
        if (currentStep === 'otp' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [currentStep, timeLeft]);

    useEffect(() => {
        if (user) {
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate("/");
            }
        }
    }, [status, user, navigate, isAdmin]);

    useEffect(() => {
        const otpString = otp.join('');
        const isComplete = otp.every(digit => digit !== '' && digit.length === 1);

        if (isComplete && otpString.length === 5 && /^\d{5}$/.test(otpString)) {
            handleOtpVerify();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    const validateField = useCallback((field: string, value: string | string[]): boolean => {
        let error = '';

        switch (field) {
            case 'email':
                if (!value || typeof value !== 'string' || !value.trim()) {
                    error = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'otp':
                if (Array.isArray(value)) {
                    const otpString = value.join('');
                    if (otpString.length !== 5) {
                        error = 'Please enter the complete 5-digit OTP';
                    } else if (!/^\d{5}$/.test(otpString)) {
                        error = 'OTP should contain only 5 numbers';
                    }
                }
                break;
            case 'newPassword':
                if (!value || typeof value !== 'string' || !value.trim()) {
                    error = 'New password is required';
                } else if (value.length < 6) {
                    error = 'Password must be at least 6 characters long';
                }
                break;
            case 'confirmPassword':
                if (!value || typeof value !== 'string' || !value.trim()) {
                    error = 'Please confirm your password';
                } else if (value !== newPassword) {
                    error = 'Passwords do not match';
                }
                break;
            default:
                break;
        }

        setErrors(prev => ({
            ...prev,
            [field]: error
        }));

        return error === '';
    }, [emailRegex, newPassword]);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (errors.email && value.trim()) {
            setTimeout(() => validateField('email', value), 500);
        }
    }, [errors.email, validateField]);

    const handleNewPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewPassword(value);

        if (errors.newPassword && value.trim()) {
            setTimeout(() => validateField('newPassword', value), 500);
        }

        if (confirmPassword && value !== confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: 'Passwords do not match'
            }));
        } else if (confirmPassword && value === confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: ''
            }));
        }
    }, [errors.newPassword, confirmPassword, validateField]);

    const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (errors.confirmPassword && value.trim()) {
            setTimeout(() => validateField('confirmPassword', value), 500);
        }
    }, [errors.confirmPassword, validateField]);

    const handleOtpChange = useCallback((index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 4) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            nextInput?.focus();
        }

        if (errors.otp && value) {
            setErrors(prev => ({ ...prev, otp: '' }));
        }
    }, [otp, errors.otp]);

    const handleOtpVerify = useCallback(async () => {
        const otpString = otp.join("");

        // Validate OTP length before API call
        if (otpString.length !== 5 || !/^\d{5}$/.test(otpString)) {
            setErrors(prev => ({
                ...prev,
                "otp": "Please enter a complete 5-digit OTP"
            }));
            return;
        }

        try {
            await authAPI.verifyOtp(email, +otpString);
            setEnablePassword(false);
            setOtpDisable(true);
            toast.success("OTP verified");
        } catch (error: any) {
            setErrors(prev => ({
                ...prev,
                "otp": error?.response?.data?.message || "OTP verification failed"
            }));
        }
    }, [email, otp]);

    const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    }, [otp]);

    // Form validation functions
    const isEmailFormValid = useCallback((): boolean => {
        return email.trim() !== '' && emailRegex.test(email) && !errors.email;
    }, [email, emailRegex, errors.email]);

    const isOtpFormValid = useCallback((): boolean => {
        return otp.every(digit => digit !== '') && !errors.otp;
    }, [otp, errors.otp]);

    const isResetFormValid = useCallback((): boolean => {
        return newPassword.trim() !== '' &&
            confirmPassword.trim() !== '' &&
            newPassword.length >= 6 &&
            newPassword === confirmPassword &&
            !errors.newPassword &&
            !errors.confirmPassword;
    }, [newPassword, confirmPassword, errors.newPassword, errors.confirmPassword]);

    const resendOtp = useCallback(async (email: string) => {
        await authAPI.requestPasswordReset(email);
    }, []);

    // Form submission handlers
    const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateField('email', email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);

        try {
            await authAPI.requestPasswordReset(email);
            toast.success('OTP sent to your email address');
            setCurrentStep('otp');
            setTimeLeft(60);
        } catch (error: any) {
            toast.error(error?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [email, validateField]);

    const handlePasswordResetSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        const newPasswordValid = validateField('newPassword', newPassword);
        const confirmPasswordValid = validateField('confirmPassword', confirmPassword);

        if (!newPasswordValid || !confirmPasswordValid) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            await dispatch(forgotPassword({ 
                email, 
                otp: Number(otp.join('')), 
                password: newPassword 
            })).unwrap();

            toast.success('Password reset successfully');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [email, otp, newPassword, confirmPassword, validateField, dispatch]);

    const handleResendOtp = useCallback(async () => {
        if (timeLeft > 0 || isLoading) return;

        setIsLoading(true);

        try {
            await resendOtp(email);
            setOtp(['', '', '', '', '']);
            setOtpDisable(false);
            setConfirmPassword("");
            setNewPassword("");
            setEnablePassword(true);
            setErrors({
                email: '',
                otp: '',
                newPassword: '',
                confirmPassword: ''
            });
            setTimeLeft(60);
            toast.success('OTP resent successfully');
        } catch (error: any) {
            toast.error(error?.message || 'Failed to resend OTP');
        } finally {
            setIsLoading(false);
        }
    }, [timeLeft, isLoading, email, resendOtp]);

    const handleBackToEmail = useCallback(() => {
        setCurrentStep('email');
    }, []);

    return {
        // State
        currentStep,
        email,
        otp,
        newPassword,
        confirmPassword,
        isSubmitting,
        timeLeft,
        isLoading,
        enablePassword,
        otpDisable,
        errors,
        // Handlers
        handleEmailChange,
        handleOtpChange,
        handleNewPasswordChange,
        handleConfirmPasswordChange,
        handleKeyDown,
        handleEmailSubmit,
        handlePasswordResetSubmit,
        handleResendOtp,
        handleBackToEmail,
        // Validators
        isEmailFormValid,
        isOtpFormValid,
        isResetFormValid,
    };
};


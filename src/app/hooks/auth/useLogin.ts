import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginUser } from '../../../features/auth/userThunks';

export type LoginErrors = {
    email: string;
    password: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const useLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<LoginErrors>({
        email: '',
        password: ''
    });

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { user } = useAppSelector(state => state.user);
    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true);

    const validateField = (field: keyof LoginErrors, value: string) => {
        let error = '';

        if (field === 'email') {
            if (!value.trim()) {
                error = 'Email is required';
            } else if (!emailRegex.test(value)) {
                error = 'Please enter a valid email address';
            }
        }

        if (field === 'password') {
            if (!value.trim()) {
                error = 'Password is required';
            } else if (value.length < 6) {
                error = 'Password must be at least 6 characters long';
            }
        }

        setErrors(prev => ({
            ...prev,
            [field]: error
        }));

        return error === '';
    };

    const validateForm = () => {
        const emailValid = validateField('email', email);
        const passwordValid = validateField('password', password);

        return emailValid && passwordValid;
    };

    const isFormValid = useMemo(() => {
        return (
            email.trim() !== '' &&
            password.trim() !== '' &&
            emailRegex.test(email) &&
            password.length >= 6 &&
            !errors.email &&
            !errors.password
        );
    }, [email, password, errors.email, errors.password]);

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setEmail(value);

        if (errors.email && value.trim()) {
            setTimeout(() => validateField('email', value), 500);
        }
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setPassword(value);

        if (errors.password && value.trim()) {
            setTimeout(() => validateField('password', value), 500);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form', { theme: 'dark' });
            return;
        }

        setIsSubmitting(true);

        try {
            await dispatch(loginUser({ email, password })).unwrap();
        } catch (error) {
            const responseError = error as
                | string
                | {
                      message?: string;
                      data?: { message?: string; error?: string };
                  };
            const message =
                typeof responseError === 'string'
                    ? responseError
                    : responseError?.data?.message ||
                      responseError?.data?.error ||
                      responseError?.message ||
                      'Login failed. Please check your credentials.';
            toast.error(message, { theme: 'dark' });
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (!user) {
            return;
        }

        if (isAdmin) {
            navigate('/admin/dashboard');
        } else {
            navigate('/');
        }
    }, [isAdmin, navigate, user]);

    return {
        email,
        errors,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit,
        isFormValid,
        isSubmitting,
        password
    };
};

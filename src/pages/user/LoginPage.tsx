

import React from 'react';
import Navbar from '../../components/user/Navbar';
import { useLogin } from '../../app/hooks/auth/useLogin';
import LoginHeroPanel from '../../components/login/LoginHeroPanel';
import LoginForm from '../../components/login/LoginForm';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage: React.FC = () => {
    const {
        email,
        password,
        errors,
        handleEmailChange,
        handlePasswordChange,
        handleSubmit,
        isFormValid,
        isSubmitting
    } = useLogin();

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="flex min-h-[calc(100vh-88px)]">
                <LoginHeroPanel />
                <LoginForm
                    email={email}
                    errors={errors}
                    isFormValid={isFormValid}
                    isSubmitting={isSubmitting}
                    onEmailChange={handleEmailChange}
                    onPasswordChange={handlePasswordChange}
                    onSubmit={handleSubmit}
                    password={password}
                />
            </div>
        </div>
    );
};

export default LoginPage;

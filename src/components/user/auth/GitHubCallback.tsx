

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { githubOAuthLogin } from '../../../features/auth/userThunks';
import { toast } from 'react-toastify';

const getBackendMessage = (payload: unknown, fallback: string) => {
    if (!payload) {
        return fallback;
    }

    if (typeof payload === 'string') {
        return payload;
    }

    if (typeof payload === 'object') {
        const data = payload as { message?: string; error?: string };
        return data.message || data.error || fallback;
    }

    return fallback;
};

const GitHubCallback: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleGitHubCallback = async () => {
            const urlParams = new URLSearchParams(location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            if (error) {
                console.error('GitHub OAuth error:', error);
                toast.error(getBackendMessage(error, 'GitHub authentication failed. Please try again.'));
                navigate('/login');
                return;
            }

            if (code) {
                try {
                    const result = await dispatch(githubOAuthLogin({ code }));

                    if (githubOAuthLogin.fulfilled.match(result)) {
                        navigate('/');
                    } else {
                        toast.error(getBackendMessage(result.payload, 'GitHub authentication failed. Please try again.'));
                        navigate('/login');
                    }
                } catch (err) {
                    toast.error(getBackendMessage(err, 'GitHub authentication failed. Please try again.'));
                    navigate('/login');
                }
            }
        };

        handleGitHubCallback();
    }, [location, navigate, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Completing GitHub authentication...</p>
            </div>
        </div>
    );
};

export default GitHubCallback;

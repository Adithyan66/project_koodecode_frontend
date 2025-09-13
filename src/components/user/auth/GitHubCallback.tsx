

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { githubOAuthLogin } from '../../../features/auth/userThunks';

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
                navigate('/login');
                return;
            }

            if (code) {
                const result = await dispatch(githubOAuthLogin({ code }));

                if (githubOAuthLogin.fulfilled.match(result)) {
                    navigate('/');
                } else {
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

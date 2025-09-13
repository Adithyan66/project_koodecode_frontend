


import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { googleOAuthLogin } from '../../../features/auth/userThunks';

interface AuthOButtonsProps {
    isSubmitting: boolean;
    process: "signup" | "login";
}

const AuthOButtons: React.FC<AuthOButtonsProps> = ({ isSubmitting, process }) => {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();


    const { user, status } = useAppSelector(state => state.user);
    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsGoogleLoading(true);
            setError(null);

            try {
                console.log("token response ", tokenResponse);

                const result = await dispatch(googleOAuthLogin({
                    token: tokenResponse.access_token
                }));

                if (googleOAuthLogin.fulfilled.match(result)) {
                    if (result.payload.isAdmin) {
                        navigate('/admin/dashboard');
                    } else {
                        navigate("/")
                    }
                } else {
                    console.log(error);
                    // setError(result.payload as string || 'Google authentication failed');
                }
            } catch (error) {
                setError('Google authentication failed. Please try again.');
            } finally {
                setIsGoogleLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google OAuth error:', error);
            setError('Google authentication failed. Please try again.');
        },
    });

    // GitHub OAuth Handler
    const handleGithubLogin = () => {
        setIsGithubLoading(true);
        setError(null);

        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/github/callback`;
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;

        window.location.href = githubAuthUrl;
    };

    useEffect(() => {
        if (user) {
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate("/")
            }
        }
    }, [status, user, navigate]);

    return (
        <div className="mt-8 space-y-3">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Google login */}
            <button
                onClick={() => googleLogin()}
                className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg py-3 px-4 flex items-center justify-center space-x-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || isGoogleLoading || isGithubLoading}
            >
                {isGoogleLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-black">G</span>
                    </div>
                )}
                <span className="text-white font-medium">
                    {isGoogleLoading ? 'Authenticating...' : `${process} with Google`}
                </span>
            </button>

            {/* Github login */}
            <button
                onClick={handleGithubLogin}
                className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg py-3 px-4 flex items-center justify-center space-x-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || isGoogleLoading || isGithubLoading}
            >
                {isGithubLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                )}
                <span className="text-white font-medium">
                    {isGithubLoading ? 'Redirecting...' : `${process} with GitHub`}
                </span>
            </button>
        </div>
    )
}


export default AuthOButtons;

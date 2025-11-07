import React, { type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import AuthOButtons from '../user/buttons/Auth0Buttons';
import { type LoginErrors } from '../../app/hooks/auth/useLogin';

type LoginFormProps = {
    email: string;
    errors: LoginErrors;
    isFormValid: boolean;
    isSubmitting: boolean;
    onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    password: string;
};

const LoginForm: React.FC<LoginFormProps> = ({
    email,
    errors,
    isFormValid,
    isSubmitting,
    onEmailChange,
    onPasswordChange,
    onSubmit,
    password
}) => (
    <div className="flex-1 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
            <h1 className="text-5xl font-bold mb-2">Welcome</h1>
            <p className="text-gray-400 mb-8">We are glad to see you back with us</p>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <User size={20} />
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={onEmailChange}
                        className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.email
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                            }`}
                        disabled={isSubmitting}
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1 ml-1">{errors.email}</p>
                    )}
                </div>

                <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock size={20} />
                    </div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={onPasswordChange}
                        className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.password
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                            }`}
                        disabled={isSubmitting}
                    />
                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1 ml-1">{errors.password}</p>
                    )}
                </div>
                <div className="text-end">
                    <Link to="/forgot" className="text-white-400 hover:text-white-300 font-medium">
                        <span className="text-gray-400">Forgot your password ?</span>
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full font-semibold py-4 rounded-lg transition-colors uppercase tracking-wider ${!isFormValid || isSubmitting
                        ? 'bg-green-600 text-green-400 cursor-not-allowed'
                        : 'bg-green-700 hover:bg-green-600 text-white'
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Logging in...
                        </span>
                    ) : (
                        <span className="text-white">Log in</span>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <span className="text-gray-400">Don't have an account ?</span>
                <Link to="/signup" className="text-green-400 hover:text-green-300 font-medium">
                    Signup
                </Link>
            </div>

            <AuthOButtons isSubmitting={isSubmitting} process="login" />
        </div>
    </div>
);

export default LoginForm;

import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmailStepProps {
    email: string;
    error: string;
    isSubmitting: boolean;
    isEmailFormValid: () => boolean;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const EmailStep = ({
    email,
    error,
    isSubmitting,
    isEmailFormValid,
    onEmailChange,
    onSubmit,
}: EmailStepProps) => {
    return (
        <div className="w-full max-w-md">
            <div className="mb-8">
                <h1 className="text-5xl font-bold mb-2">Forgot Password</h1>
                <p className="text-gray-400">Enter your email address and we'll send you an OTP to reset your password</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Email field */}
                <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail size={20} />
                    </div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={onEmailChange}
                        className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                            }`}
                        disabled={isSubmitting}
                    />
                    {error && (
                        <p className="text-red-400 text-sm mt-1 ml-1">{error}</p>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={!isEmailFormValid() || isSubmitting}
                    className={`w-full font-semibold py-4 rounded-lg transition-colors uppercase tracking-wider ${!isEmailFormValid() || isSubmitting
                        ? 'bg-green-600 text-green-400 cursor-not-allowed'
                        : 'bg-green-700 hover:bg-green-600 text-white'
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending OTP...
                        </span>
                    ) : (
                        'Send OTP'
                    )}
                </button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
                <Link to="/login" className="text-green-400 hover:text-green-300 font-medium inline-flex items-center">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default EmailStep;


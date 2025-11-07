import { Lock } from 'lucide-react';

interface PasswordResetFormProps {
    newPassword: string;
    confirmPassword: string;
    enablePassword: boolean;
    isSubmitting: boolean;
    errors: {
        newPassword: string;
        confirmPassword: string;
    };
    isResetFormValid: () => boolean;
    onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const PasswordResetForm = ({
    newPassword,
    confirmPassword,
    enablePassword,
    isSubmitting,
    errors,
    isResetFormValid,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
}: PasswordResetFormProps) => {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            {/* New Password field */}
            <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                </div>
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={onNewPasswordChange}
                    className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.newPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                        }
                        ${enablePassword ? 'cursor-not-allowed' : ''}
                        `}
                    disabled={enablePassword || isSubmitting}
                />
                {errors.newPassword && (
                    <p className="text-red-400 text-sm mt-1 ml-1">{errors.newPassword}</p>
                )}
            </div>

            {/* Confirm Password field */}
            <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={20} />
                </div>
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={onConfirmPasswordChange}
                    className={`w-full bg-gray-800 border rounded-lg py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-1 transition-colors ${errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-700 focus:border-green-500 focus:ring-green-500'
                        }
                         ${enablePassword ? 'cursor-not-allowed' : ''}
                        `}
                    disabled={enablePassword || isSubmitting}
                />
                {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1 ml-1">{errors.confirmPassword}</p>
                )}
            </div>

            {/* Reset button */}
            <button
                type="submit"
                disabled={!isResetFormValid() || isSubmitting}
                className={`w-full font-semibold py-4 rounded-lg transition-colors uppercase tracking-wider ${!isResetFormValid() || isSubmitting
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
                        Resetting Password...
                    </span>
                ) : (
                    'Reset Password'
                )}
            </button>
        </form>
    );
};

export default PasswordResetForm;


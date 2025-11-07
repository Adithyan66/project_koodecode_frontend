import { ArrowLeft } from 'lucide-react';
import OtpInput from './OtpInput';
import PasswordResetForm from './PasswordResetForm';

interface OtpStepProps {
    otp: string[];
    timeLeft: number;
    isLoading: boolean;
    otpDisable: boolean;
    enablePassword: boolean;
    newPassword: string;
    confirmPassword: string;
    isSubmitting: boolean;
    errors: {
        otp: string;
        newPassword: string;
        confirmPassword: string;
    };
    isResetFormValid: () => boolean;
    onOtpChange: (index: number, value: string) => void;
    onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
    onResendOtp: () => void;
    onPasswordResetSubmit: (e: React.FormEvent) => void;
    onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBackToEmail: () => void;
}

const OtpStep = ({
    otp,
    timeLeft,
    isLoading,
    otpDisable,
    enablePassword,
    newPassword,
    confirmPassword,
    isSubmitting,
    errors,
    isResetFormValid,
    onOtpChange,
    onKeyDown,
    onResendOtp,
    onPasswordResetSubmit,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onBackToEmail,
}: OtpStepProps) => {
    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-4">2 Factor Authentication</h1>
                <p className="text-gray-400 mb-8">Check your email and enter your one-time-password.</p>

                {/* OTP Input Boxes */}
                <OtpInput
                    otp={otp}
                    onOtpChange={onOtpChange}
                    onKeyDown={onKeyDown}
                    disabled={otpDisable || isLoading}
                    error={errors.otp}
                />

                {/* Timer */}
                <p className="text-gray-400 mb-4">
                    OTP will expire in <span className="text-white font-semibold">00:{timeLeft.toString().padStart(2, '0')}</span>
                </p>

                {/* Resend OTP button */}
                <button
                    className={`text-sm underline transition-colors ${timeLeft > 0 || isLoading
                        ? 'text-gray-500 cursor-not-allowed'
                        : 'text-green-400 hover:text-green-300'
                        }`}
                    onClick={onResendOtp}
                    disabled={timeLeft > 0 || isLoading}
                >
                    {isLoading ? 'Resending...' : 'Resend OTP'}
                </button>
            </div>

            <PasswordResetForm
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                enablePassword={enablePassword}
                isSubmitting={isSubmitting}
                errors={errors}
                isResetFormValid={isResetFormValid}
                onNewPasswordChange={onNewPasswordChange}
                onConfirmPasswordChange={onConfirmPasswordChange}
                onSubmit={onPasswordResetSubmit}
            />

            {/* Back button */}
            <div className="mt-6 text-center">
                <button
                    onClick={onBackToEmail}
                    className="text-green-400 hover:text-green-300 font-medium inline-flex items-center"
                    disabled={isSubmitting}
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Change Email
                </button>
            </div>
        </div>
    );
};

export default OtpStep;


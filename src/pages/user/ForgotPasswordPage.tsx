import LoginHero from "../../assets/images/login_student-removebg-preview.png";
import Navbar from '../../components/user/Navbar';
import 'react-toastify/dist/ReactToastify.css';
import { useForgotPassword } from '../../app/hooks/auth/useForgotPassword';
import EmailStep from '../../components/forgotPassword/EmailStep';
import OtpStep from '../../components/forgotPassword/OtpStep';

const ForgotPasswordPage = () => {
    const {
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
        isResetFormValid,
    } = useForgotPassword();

    const renderStepContent = () => {
        switch (currentStep) {
            case 'email':
                return (
                    <EmailStep
                        email={email}
                        error={errors.email}
                        isSubmitting={isSubmitting}
                        isEmailFormValid={isEmailFormValid}
                        onEmailChange={handleEmailChange}
                        onSubmit={handleEmailSubmit}
                    />
                );

            case 'otp':
                return (
                    <OtpStep
                        otp={otp}
                        timeLeft={timeLeft}
                        isLoading={isLoading}
                        otpDisable={otpDisable}
                        enablePassword={enablePassword}
                        newPassword={newPassword}
                        confirmPassword={confirmPassword}
                        isSubmitting={isSubmitting}
                        errors={errors}
                        isResetFormValid={isResetFormValid}
                        onOtpChange={handleOtpChange}
                        onKeyDown={handleKeyDown}
                        onResendOtp={handleResendOtp}
                        onPasswordResetSubmit={handlePasswordResetSubmit}
                        onNewPasswordChange={handleNewPasswordChange}
                        onConfirmPasswordChange={handleConfirmPasswordChange}
                        onBackToEmail={handleBackToEmail}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <div className="flex min-h-[calc(100vh-88px)]">
                {/* Left side with character */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="relative">
                        <img
                            src={LoginHero}
                            alt="Character"
                            className="w-150 h-150 object-cover rounded-full opacity-80"
                        />
                    </div>
                </div>

                {/* Right side with form */}
                <div className="flex-1 flex flex-col justify-center items-center p-8">
                    {renderStepContent()}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;

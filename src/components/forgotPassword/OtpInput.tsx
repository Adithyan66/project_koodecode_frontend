interface OtpInputProps {
    otp: string[];
    onOtpChange: (index: number, value: string) => void;
    onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: string;
}

const OtpInput = ({ otp, onOtpChange, onKeyDown, disabled, error }: OtpInputProps) => {
    return (
        <>
            <div className="flex justify-center space-x-3 mb-6">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => onOtpChange(index, e.target.value)}
                        onKeyDown={(e) => onKeyDown(index, e)}
                        className="w-12 h-12 bg-transparent border-2 border-gray-600 rounded-lg text-center text-white text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors"
                        disabled={disabled}
                    />
                ))}
            </div>
            {error && (
                <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
            )}
        </>
    );
};

export default OtpInput;


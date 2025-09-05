// // import React, { useEffect, useState } from 'react';

// // import LoginHero from "../../assets/images/login_student-removebg-preview.png"
// // import { Link } from 'react-router-dom';
// // import { useNavigate } from 'react-router-dom';
// // import Navbar from '../../components/user/Navbar';
// // import { Check } from 'lucide-react';
// // import axios from 'axios'
// // import { useAppDispatch, useAppSelector } from '../../app/hooks';
// // import { tokenManager } from '../../utils/tokenManager';

// // import { signupUser } from '../../features/auth/userThunks';

// // const SignupPage: React.FC = () => {


// //     const [name, setName] = useState('');
// //     const [username, setUsername] = useState('');
// //     const [email, setEmail] = useState('');

// //     const navigate = useNavigate()
// //     const dispatch = useAppDispatch()

// //     const [otpPage, setOtpPage] = useState(false)
// //     const [otp, setOtp] = useState(['', '', '', '', '']);
// //     const [password, setPassword] = useState('');
// //     const [confirmPassword, setConfirmPassword] = useState('');
// //     const [timeLeft, setTimeLeft] = useState(0);
// //     const [showPasswordSection, setShowPasswordSection] = useState(false);

// //     const { user, status } = useAppSelector(state => state.user);

// //     const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)


// //     useEffect(() => {
// //         if (timeLeft > 0) {
// //             const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
// //             return () => clearTimeout(timer);
// //         }
// //     }, [timeLeft]);



// //     const handleOtpChange = (index: number, value: string) => {
// //         if (value.length <= 1) {
// //             const newOtp = [...otp];
// //             newOtp[index] = value;
// //             setOtp(newOtp);

// //             // Auto focus next input
// //             if (value && index < 4) {
// //                 const nextInput = document.getElementById(`otp-${index + 1}`);
// //                 nextInput?.focus();
// //             }

// //             // Show password section if all OTP fields are filled
// //             if (newOtp.every(digit => digit !== '')) {
// //                 setTimeout(() => setShowPasswordSection(true), 500);
// //             }
// //         }
// //     };


// //     const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
// //         if (e.key === 'Backspace' && !otp[index] && index > 0) {
// //             const prevInput = document.getElementById(`otp-${index - 1}`);
// //             prevInput?.focus();
// //         }
// //     };


// //     async function requestOtp() {


// //         try {
// //             const response = await axios.post("http://localhost:3000/api/auth/signup/request-otp", {
// //                 email,
// //                 userName: username,
// //                 fullName: name
// //             });
// //             console.log("✅ Signup success:", response.data);
// //             if (response.data.success) {
// //                 setTimeLeft(59)
// //                 setOtpPage(true)
// //             }
// //         } catch (error) {
// //             if (axios.isAxiosError(error)) {
// //                 console.error("❌ Axios error:", error.response?.data || error.message);
// //             } else {
// //                 console.error("❌ Unexpected error:", error);
// //             }
// //         }
// //     }

// //     async function createAccount() {

// //         dispatch(signupUser({ email, password: confirmPassword, otp: Number(otp.join("")) }))

// //     }

// //     useEffect(() => {

// //         if (user) {
// //             if (isAdmin) {
// //                 navigate('/admin/dashboard');
// //             } else {
// //                 navigate("/")
// //             }
// //         }
// //     }, [status, user, navigate]);



// //     return (
// //         <div className="min-h-screen bg-black text-white">

// //             <Navbar />
// //             <div className="flex min-h-[calc(100vh-88px)]">
// //                 {/* Left side with character */}
// //                 <div className="flex-1 flex items-center justify-center">
// //                     <div className="relative">
// //                         <img
// //                             src={LoginHero}
// //                             alt="Character"
// //                             className="w-150 h-150 object-cover rounded-full opacity-80"
// //                         />
// //                     </div>
// //                 </div>
// //                 {/* Right side with signup form */}
// //                 {(!otpPage) ?
// //                     <div className="flex-1 flex flex-col justify-center items-center p-8">
// //                         <div className="w-full max-w-md">
// //                             <div className="space-y-6 mb-6">
// //                                 {/* Name and User Name fields - side by side */}
// //                                 <div className="grid grid-cols-2 gap-4">
// //                                     <div>
// //                                         <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
// //                                         <input
// //                                             type="text"
// //                                             value={name}
// //                                             onChange={(e) => setName(e.target.value)}
// //                                             className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
// //                                         />
// //                                     </div>
// //                                     <div>
// //                                         <label className="block text-sm font-medium text-gray-400 mb-2">User Name</label>
// //                                         <input
// //                                             type="text"
// //                                             value={username}
// //                                             onChange={(e) => setUsername(e.target.value)}
// //                                             className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
// //                                         />
// //                                     </div>
// //                                 </div>

// //                                 {/* Email field - full width */}
// //                                 <div>
// //                                     <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
// //                                     <input
// //                                         type="email"
// //                                         value={email}
// //                                         onChange={(e) => setEmail(e.target.value)}
// //                                         className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
// //                                     />
// //                                 </div>

// //                                 {/* Create Account button */}
// //                                 <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-4 rounded-lg transition-colors"
// //                                     // onClick={() => setOtpPage(true)}
// //                                     onClick={() => requestOtp()}
// //                                 >
// //                                     Create Account
// //                                 </button>
// //                             </div>

// //                             {/* Login link */}
// //                             <div className="text-center mb-8">
// //                                 <span className="text-gray-400">Already have an account? </span>
// //                                 <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
// //                                     Login
// //                                 </Link>
// //                             </div>

// //                             {/* Divider with "or" */}
// //                             <div className="relative mb-8">
// //                                 <div className="absolute inset-0 flex items-center">
// //                                     <div className="w-full border-t border-gray-600"></div>
// //                                 </div>
// //                                 <div className="relative flex justify-center text-sm">
// //                                     <span className="px-4 bg-black text-gray-400">or</span>
// //                                 </div>
// //                             </div>

// //                             {/* Social signup buttons */}
// //                             <div className="grid grid-cols-2 gap-4">
// //                                 {/* Google signup */}
// //                                 <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
// //                                     <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border">
// //                                         <span className="text-xs font-bold text-red-500">G</span>
// //                                     </div>
// //                                     <span className="text-sm">Sign up with Google</span>
// //                                 </button>

// //                                 {/* Facebook signup */}
// //                                 <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
// //                                 >
// //                                     <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
// //                                         <span className="text-xs font-bold text-blue-600">f</span>
// //                                     </div>
// //                                     <span className="text-sm">Sign up with Facebook</span>
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     </div>
// //                     :
// //                     <div className="flex-1 flex flex-col justify-center items-center p-8">
// //                         <div className="w-full max-w-md">
// //                             {/* 2FA Section */}
// //                             <div className="text-center mb-8">
// //                                 <h1 className="text-3xl font-bold mb-4">2 Factor Authentication</h1>
// //                                 <p className="text-gray-400 mb-8">Check your email and enter your one-time-password.</p>

// //                                 {/* OTP Input Boxes */}
// //                                 <div className="flex justify-center space-x-3 mb-6">
// //                                     {otp.map((digit, index) => (
// //                                         <input
// //                                             key={index}
// //                                             id={`otp-${index}`}
// //                                             type="text"
// //                                             maxLength={1}
// //                                             value={digit}
// //                                             onChange={(e) => handleOtpChange(index, e.target.value)}
// //                                             onKeyDown={(e) => handleKeyDown(index, e)}
// //                                             className="w-12 h-12 bg-transparent border-2 border-gray-600 rounded-lg text-center text-white text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors"
// //                                         />
// //                                     ))}
// //                                 </div>

// //                                 {/* Timer */}
// //                                 <p className="text-gray-400 mb-4">
// //                                     OTP will Expires in <span className="text-white font-semibold">00:{timeLeft.toString().padStart(2, '0')}</span>
// //                                 </p>

// //                                 {/* Didn't get OTP link */}
// //                                 <button className="text-gray-500 hover:text-gray-400 underline text-sm"
// //                                     onClick={() => requestOtp()}
// //                                 >
// //                                     I didn't get the OTP
// //                                 </button>
// //                             </div>

// //                             {/* Password Creation Section */}
// //                             <div className={`transition-all duration-500 ${showPasswordSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
// //                                 {showPasswordSection && (
// //                                     <>
// //                                         {/* Success Icon */}
// //                                         <div className="flex justify-center mb-6">
// //                                             <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
// //                                                 <Check size={32} className="text-white" />
// //                                             </div>
// //                                         </div>

// //                                         {/* Create Password Section */}
// //                                         <div className="text-center mb-8">
// //                                             <h2 className="text-2xl font-bold mb-6">Create Password</h2>

// //                                             <div className="space-y-4">
// //                                                 {/* Password field */}
// //                                                 <input
// //                                                     type="password"
// //                                                     placeholder="password"
// //                                                     value={password}
// //                                                     onChange={(e) => setPassword(e.target.value)}
// //                                                     className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
// //                                                 />

// //                                                 {/* Confirm Password field */}
// //                                                 <input
// //                                                     type="password"
// //                                                     placeholder="confirm password"
// //                                                     value={confirmPassword}
// //                                                     onChange={(e) => setConfirmPassword(e.target.value)}
// //                                                     className="w-full bg-transparent border border-gray-600 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
// //                                                 />

// //                                                 {/* Create Account Button */}
// //                                                 <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-3 rounded-lg transition-colors mt-6"
// //                                                     onClick={() => createAccount()}
// //                                                 >
// //                                                     Create Account
// //                                                 </button>
// //                                             </div>
// //                                         </div>
// //                                     </>
// //                                 )}
// //                             </div>
// //                         </div>
// //                     </div>
// //                 }
// //             </div>
// //         </div>
// //     );
// // };


// // export default SignupPage;










// import React, { useEffect, useState } from 'react';
// import LoginHero from "../../assets/images/login_student-removebg-preview.png"
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../../components/user/Navbar';
// import { Check, AlertCircle } from 'lucide-react';
// import axios from 'axios'
// import { useAppDispatch, useAppSelector } from '../../app/hooks';
// import { tokenManager } from '../../utils/tokenManager';
// import { signupUser } from '../../features/auth/userThunks';

// // Toast Component
// interface ToastProps {
//     message: string;
//     type: 'success' | 'error' | 'info';
//     onClose: () => void;
// }

// const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             onClose();
//         }, 5000);
//         return () => clearTimeout(timer);
//     }, [onClose]);

//     const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
//     return (
//         <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-slide-in`}>
//             <AlertCircle size={20} />
//             <span>{message}</span>
//             <button onClick={onClose} className="ml-2 text-white hover:text-gray-200">
//                 ×
//             </button>
//         </div>
//     );
// };

// const SignupPage: React.FC = () => {
//     const [name, setName] = useState('');
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');

//     const navigate = useNavigate()
//     const dispatch = useAppDispatch()

//     const [otpPage, setOtpPage] = useState(false)
//     const [otp, setOtp] = useState(['', '', '', '', '']);
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [timeLeft, setTimeLeft] = useState(0);
//     const [showPasswordSection, setShowPasswordSection] = useState(false);

//     // Validation states
//     const [errors, setErrors] = useState<{[key: string]: string}>({});
//     const [isLoading, setIsLoading] = useState(false);
    
//     // Toast state
//     const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

//     const { user, status } = useAppSelector(state => state.user);
//     const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)

//     useEffect(() => {
//         if (timeLeft > 0) {
//             const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [timeLeft]);

//     const showToast = (message: string, type: 'success' | 'error' | 'info') => {
//         setToast({ message, type });
//     };

//     // Validation functions
//     const validateName = (name: string): string => {
//         if (!name.trim()) return 'Name is required';
//         if (name.trim().length < 2) return 'Name must be at least 2 characters';
//         if (!/^[a-zA-Z\s]+$/.test(name.trim())) return 'Name can only contain letters and spaces';
//         return '';
//     };

//     const validateUsername = (username: string): string => {
//         if (!username.trim()) return 'Username is required';
//         if (username.length < 3) return 'Username must be at least 3 characters';
//         if (username.length > 20) return 'Username must not exceed 20 characters';
//         if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
//         return '';
//     };

//     const validateEmail = (email: string): string => {
//         if (!email.trim()) return 'Email is required';
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) return 'Please enter a valid email address';
//         return '';
//     };

//     const validatePassword = (password: string): string => {
//         if (!password) return 'Password is required';
//         if (password.length < 8) return 'Password must be at least 8 characters';
//         if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
//         if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
//         if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
//         if (!/(?=.*[@$!%*?&])/.test(password)) return 'Password must contain at least one special character';
//         return '';
//     };

//     const validateConfirmPassword = (password: string, confirmPassword: string): string => {
//         if (!confirmPassword) return 'Please confirm your password';
//         if (password !== confirmPassword) return 'Passwords do not match';
//         return '';
//     };

//     const validateOtp = (otp: string[]): string => {
//         const otpString = otp.join('');
//         if (otpString.length !== 5) return 'Please enter the complete 5-digit OTP';
//         if (!/^\d+$/.test(otpString)) return 'OTP can only contain numbers';
//         return '';
//     };

//     // Handle field changes with real-time validation
//     const handleNameChange = (value: string) => {
//         setName(value);
//         if (errors.name) {
//             const error = validateName(value);
//             setErrors(prev => ({ ...prev, name: error }));
//         }
//     };

//     const handleUsernameChange = (value: string) => {
//         setUsername(value);
//         if (errors.username) {
//             const error = validateUsername(value);
//             setErrors(prev => ({ ...prev, username: error }));
//         }
//     };

//     const handleEmailChange = (value: string) => {
//         setEmail(value);
//         if (errors.email) {
//             const error = validateEmail(value);
//             setErrors(prev => ({ ...prev, email: error }));
//         }
//     };

//     const handlePasswordChange = (value: string) => {
//         setPassword(value);
//         if (errors.password) {
//             const error = validatePassword(value);
//             setErrors(prev => ({ ...prev, password: error }));
//         }
//         // Re-validate confirm password if it exists
//         if (confirmPassword) {
//             const confirmError = validateConfirmPassword(value, confirmPassword);
//             setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
//         }
//     };

//     const handleConfirmPasswordChange = (value: string) => {
//         setConfirmPassword(value);
//         if (errors.confirmPassword) {
//             const error = validateConfirmPassword(password, value);
//             setErrors(prev => ({ ...prev, confirmPassword: error }));
//         }
//     };

//     const handleOtpChange = (index: number, value: string) => {
//         if (value.length <= 1 && /^\d*$/.test(value)) {
//             const newOtp = [...otp];
//             newOtp[index] = value;
//             setOtp(newOtp);

//             // Clear OTP error if exists
//             if (errors.otp) {
//                 setErrors(prev => ({ ...prev, otp: '' }));
//             }

//             // Auto focus next input
//             if (value && index < 4) {
//                 const nextInput = document.getElementById(`otp-${index + 1}`);
//                 nextInput?.focus();
//             }

//             // Show password section if all OTP fields are filled
//             if (newOtp.every(digit => digit !== '')) {
//                 setTimeout(() => setShowPasswordSection(true), 500);
//             }
//         }
//     };

//     const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//         if (e.key === 'Backspace' && !otp[index] && index > 0) {
//             const prevInput = document.getElementById(`otp-${index - 1}`);
//             prevInput?.focus();
//         }
//     };

//     const validateForm = (): boolean => {
//         const newErrors: {[key: string]: string} = {};

//         newErrors.name = validateName(name);
//         newErrors.username = validateUsername(username);
//         newErrors.email = validateEmail(email);

//         setErrors(newErrors);

//         return !Object.values(newErrors).some(error => error !== '');
//     };

//     const validateOtpForm = (): boolean => {
//         const newErrors: {[key: string]: string} = {};

//         newErrors.otp = validateOtp(otp);
//         if (showPasswordSection) {
//             newErrors.password = validatePassword(password);
//             newErrors.confirmPassword = validateConfirmPassword(password, confirmPassword);
//         }

//         setErrors(newErrors);

//         return !Object.values(newErrors).some(error => error !== '');
//     };

//     async function requestOtp() {
//         if (!validateForm()) {
//             showToast('Please fix the errors before continuing', 'error');
//             return;
//         }

//         setIsLoading(true);
//         try {
//             const response = await axios.post("http://localhost:3000/api/auth/signup/request-otp", {
//                 email,
//                 userName: username,
//                 fullName: name
//             });
            
//             console.log("✅ Signup success:", response.data);
//             if (response.data.success) {
//                 setTimeLeft(59);
//                 setOtpPage(true);
//                 showToast('OTP sent successfully to your email', 'success');
//             }
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 console.error("❌ Axios error:", error.response?.data || error.message);
//                 const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
//                 showToast(errorMessage, 'error');
//             } else {
//                 console.error("❌ Unexpected error:", error);
//                 showToast('An unexpected error occurred. Please try again.', 'error');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     async function resendOtp() {
//         setIsLoading(true);
//         try {
//             const response = await axios.post("http://localhost:3000/api/auth/signup/request-otp", {
//                 email,
//                 userName: username,
//                 fullName: name
//             });
            
//             if (response.data.success) {
//                 setTimeLeft(59);
//                 setOtp(['', '', '', '', '']);
//                 setShowPasswordSection(false);
//                 showToast('OTP resent successfully', 'success');
//             }
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 const errorMessage = error.response?.data?.message || 'Failed to resend OTP. Please try again.';
//                 showToast(errorMessage, 'error');
//             } else {
//                 showToast('An unexpected error occurred. Please try again.', 'error');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     async function createAccount() {
//         if (!validateOtpForm()) {
//             showToast('Please fix the errors before creating account', 'error');
//             return;
//         }

//         setIsLoading(true);
//         try {
//             await dispatch(signupUser({ 
//                 email, 
//                 password: confirmPassword, 
//                 otp: Number(otp.join("")) 
//             }));
//             showToast('Account created successfully!', 'success');
//         } catch (error) {
//             showToast('Failed to create account. Please try again.', 'error');
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     useEffect(() => {
//         if (user) {
//             if (isAdmin) {
//                 navigate('/admin/dashboard');
//             } else {
//                 navigate("/")
//             }
//         }
//     }, [status, user, navigate]);

//     return (
//         <div className="min-h-screen bg-black text-white">
//             {toast && (
//                 <Toast 
//                     message={toast.message} 
//                     type={toast.type} 
//                     onClose={() => setToast(null)} 
//                 />
//             )}

//             <Navbar />
//             <div className="flex min-h-[calc(100vh-88px)]">
//                 {/* Left side with character */}
//                 <div className="flex-1 flex items-center justify-center">
//                     <div className="relative">
//                         <img
//                             src={LoginHero}
//                             alt="Character"
//                             className="w-150 h-150 object-cover rounded-full opacity-80"
//                         />
//                     </div>
//                 </div>
                
//                 {/* Right side with signup form */}
//                 {(!otpPage) ? (
//                     <div className="flex-1 flex flex-col justify-center items-center p-8">
//                         <div className="w-full max-w-md">
//                             <div className="space-y-6 mb-6">
//                                 {/* Name and User Name fields - side by side */}
//                                 <div className="grid grid-cols-2 gap-4">
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
//                                         <input
//                                             type="text"
//                                             value={name}
//                                             onChange={(e) => handleNameChange(e.target.value)}
//                                             className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${
//                                                 errors.name 
//                                                     ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
//                                                     : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
//                                             }`}
//                                         />
//                                         {errors.name && (
//                                             <p className="text-red-400 text-sm mt-1">{errors.name}</p>
//                                         )}
//                                     </div>
//                                     <div>
//                                         <label className="block text-sm font-medium text-gray-400 mb-2">User Name</label>
//                                         <input
//                                             type="text"
//                                             value={username}
//                                             onChange={(e) => handleUsernameChange(e.target.value)}
//                                             className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${
//                                                 errors.username 
//                                                     ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
//                                                     : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
//                                             }`}
//                                         />
//                                         {errors.username && (
//                                             <p className="text-red-400 text-sm mt-1">{errors.username}</p>
//                                         )}
//                                     </div>
//                                 </div>

//                                 {/* Email field - full width */}
//                                 <div>
//                                     <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
//                                     <input
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => handleEmailChange(e.target.value)}
//                                         className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${
//                                             errors.email 
//                                                 ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
//                                                 : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
//                                         }`}
//                                     />
//                                     {errors.email && (
//                                         <p className="text-red-400 text-sm mt-1">{errors.email}</p>
//                                     )}
//                                 </div>

//                                 {/* Create Account button */}
//                                 <button 
//                                     className={`w-full font-semibold py-4 rounded-lg transition-colors ${
//                                         isLoading 
//                                             ? 'bg-gray-600 cursor-not-allowed' 
//                                             : 'bg-gray-700 hover:bg-gray-600'
//                                     } text-white`}
//                                     onClick={requestOtp}
//                                     disabled={isLoading}
//                                 >
//                                     {isLoading ? 'Sending OTP...' : 'Create Account'}
//                                 </button>
//                             </div>

//                             {/* Login link */}
//                             <div className="text-center mb-8">
//                                 <span className="text-gray-400">Already have an account? </span>
//                                 <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
//                                     Login
//                                 </Link>
//                             </div>

//                             {/* Divider with "or" */}
//                             <div className="relative mb-8">
//                                 <div className="absolute inset-0 flex items-center">
//                                     <div className="w-full border-t border-gray-600"></div>
//                                 </div>
//                                 <div className="relative flex justify-center text-sm">
//                                     <span className="px-4 bg-black text-gray-400">or</span>
//                                 </div>
//                             </div>

//                             {/* Social signup buttons */}
//                             <div className="grid grid-cols-2 gap-4">
//                                 {/* Google signup */}
//                                 <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
//                                     <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border">
//                                         <span className="text-xs font-bold text-red-500">G</span>
//                                     </div>
//                                     <span className="text-sm">Sign up with Google</span>
//                                 </button>

//                                 {/* Facebook signup */}
//                                 <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
//                                     <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
//                                         <span className="text-xs font-bold text-blue-600">f</span>
//                                     </div>
//                                     <span className="text-sm">Sign up with Facebook</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="flex-1 flex flex-col justify-center items-center p-8">
//                         <div className="w-full max-w-md">
//                             {/* 2FA Section */}
//                             <div className="text-center mb-8">
//                                 <h1 className="text-3xl font-bold mb-4">2 Factor Authentication</h1>
//                                 <p className="text-gray-400 mb-8">Check your email and enter your one-time-password.</p>

//                                 {/* OTP Input Boxes */}
//                                 <div className="flex justify-center space-x-3 mb-6">
//                                     {otp.map((digit, index) => (
//                                         <input
//                                             key={index}
//                                             id={`otp-${index}`}
//                                             type="text"
//                                             maxLength={1}
//                                             value={digit}
//                                             onChange={(e) => handleOtpChange(index, e.target.value)}
//                                             onKeyDown={(e) => handleKeyDown(index, e)}
//                                             className={`w-12 h-12 bg-transparent border-2 rounded-lg text-center text-white text-lg font-semibold focus:outline-none transition-colors ${
//                                                 errors.otp 
//                                                     ? 'border-red-500 focus:border-red-500' 
//                                                     : 'border-gray-600 focus:border-green-500'
//                                             }`}
//                                         />
//                                     ))}
//                                 </div>

//                                 {errors.otp && (
//                                     <p className="text-red-400 text-sm mb-4">{errors.otp}</p>
//                                 )}

//                                 {/* Timer */}
//                                 <p className="text-gray-400 mb-4">
//                                     OTP will expire in <span className="text-white font-semibold">00:{timeLeft.toString().padStart(2, '0')}</span>
//                                 </p>

//                                 {/* Resend OTP button */}
//                                 <button 
//                                     className={`text-sm underline transition-colors ${
//                                         timeLeft > 0 
//                                             ? 'text-gray-500 cursor-not-allowed' 
//                                             : 'text-green-400 hover:text-green-300'
//                                     }`}
//                                     onClick={resendOtp}
//                                     disabled={timeLeft > 0 || isLoading}
//                                 >
//                                     {isLoading ? 'Resending...' : timeLeft > 0 ? `Resend OTP (${timeLeft}s)` : 'Resend OTP'}
//                                 </button>
//                             </div>

//                             {/* Password Creation Section */}
//                             <div className={`transition-all duration-500 ${showPasswordSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
//                                 {showPasswordSection && (
//                                     <>
//                                         {/* Success Icon */}
//                                         <div className="flex justify-center mb-6">
//                                             <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
//                                                 <Check size={32} className="text-white" />
//                                             </div>
//                                         </div>

//                                         {/* Create Password Section */}
//                                         <div className="text-center mb-8">
//                                             <h2 className="text-2xl font-bold mb-6">Create Password</h2>

//                                             <div className="space-y-4">
//                                                 {/* Password field */}
//                                                 <div>
//                                                     <input
//                                                         type="password"
//                                                         placeholder="Password"
//                                                         value={password}
//                                                         onChange={(e) => handlePasswordChange(e.target.value)}
//                                                         className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none transition-colors ${
//                                                             errors.password 
//                                                                 ? 'border-red-500 focus:border-red-500' 
//                                                                 : 'border-gray-600 focus:border-green-500'
//                                                         }`}
//                                                     />
//                                                     {errors.password && (
//                                                         <p className="text-red-400 text-sm mt-1 text-left">{errors.password}</p>
//                                                     )}
//                                                 </div>

//                                                 {/* Confirm Password field */}
//                                                 <div>
//                                                     <input
//                                                         type="password"
//                                                         placeholder="Confirm password"
//                                                         value={confirmPassword}
//                                                         onChange={(e) => handleConfirmPasswordChange(e.target.value)}
//                                                         className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none transition-colors ${
//                                                             errors.confirmPassword 
//                                                                 ? 'border-red-500 focus:border-red-500' 
//                                                                 : 'border-gray-600 focus:border-green-500'
//                                                         }`}
//                                                     />
//                                                     {errors.confirmPassword && (
//                                                         <p className="text-red-400 text-sm mt-1 text-left">{errors.confirmPassword}</p>
//                                                     )}
//                                                 </div>

//                                                 {/* Create Account Button */}
//                                                 <button 
//                                                     className={`w-full font-semibold py-3 rounded-lg transition-colors mt-6 ${
//                                                         isLoading 
//                                                             ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
//                                                             : 'bg-white hover:bg-gray-100 text-black'
//                                                     }`}
//                                                     onClick={createAccount}
//                                                     disabled={isLoading}
//                                                 >
//                                                     {isLoading ? 'Creating Account...' : 'Create Account'}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Add CSS for toast animation */}
//             <style>{`
//                 @keyframes slide-in {
//                     from {
//                         transform: translateX(100%);
//                         opacity: 0;
//                     }
//                     to {
//                         transform: translateX(0);
//                         opacity: 1;
//                     }
//                 }
//                 .animate-slide-in {
//                     animation: slide-in 0.3s ease-out;
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default SignupPage;














import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginHero from "../../assets/images/login_student-removebg-preview.png"
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/user/Navbar';
import { Check } from 'lucide-react';
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { signupUser } from '../../features/auth/userThunks';

const SignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    
    const [otpPage, setOtpPage] = useState(false)
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { user, status, error } = useAppSelector(state => state.user);
    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true)

    // Validation functions (keep your existing validation logic)
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateName = (name: string): boolean => {
        return name.trim().length >= 2;
    };

    const validateUsername = (username: string): boolean => {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const validateInitialForm = (): boolean => {
        if (!validateName(name)) {
            toast.error('Name must be at least 2 characters long');
            return false;
        }
        
        if (!validateUsername(username)) {
            toast.error('Username must be 3-20 characters long and contain only letters, numbers, and underscores');
            return false;
        }
        
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return false;
        }
        
        return true;
    };

    const validatePasswordForm = (): boolean => {
        if (!validatePassword(password)) {
            toast.error('Password must be at least 6 characters long');
            return false;
        }
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return false;
        }
        
        return true;
    };

    const validateOTP = (): boolean => {
        const otpValue = otp.join('');
        if (otpValue.length !== 5) {
            toast.error('Please enter the complete 5-digit OTP');
            return false;
        }
        
        if (!/^\d+$/.test(otpValue)) {
            toast.error('OTP must contain only numbers');
            return false;
        }
        
        return true;
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto focus next input
            if (value && index < 4) {
                const nextInput = document.getElementById(`otp-${index + 1}`);
                nextInput?.focus();
            }

            // Show password section if all OTP fields are filled
            if (newOtp.every(digit => digit !== '')) {
                setTimeout(() => setShowPasswordSection(true), 500);
            } else {
                setShowPasswordSection(false);
            }
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            prevInput?.focus();
        }
    };

    async function requestOtp() {
        if (!validateInitialForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:3000/api/auth/signup/request-otp", {
                email,
                userName: username,
                fullName: name
            });
            
            if (response.data.success) {
                setTimeLeft(59);
                setOtpPage(true);
                toast.success('OTP sent to your email successfully!');
            } else {
                toast.error(response.data.message || 'Failed to send OTP');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
                toast.error(errorMessage);
            } else {
                toast.error('An unexpected error occurred');
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function createAccount() {
        if (!validateOTP() || !validatePasswordForm()) {
            return;
        }

        setIsLoading(true);
        
        try {
            // Use unwrap() to get the actual result and handle rejections properly
            const result = await dispatch(signupUser({ 
                email, 
                password: confirmPassword, 
                otp: Number(otp.join("")) 
            })).unwrap();
            
            // This will only execute if the thunk was fulfilled
            toast.success('Account created successfully!');
            
        } catch (error: any) {
            // This will execute if the thunk was rejected
            console.error('Signup error:', error);
            
            // Handle different types of errors
            if (error.error) {
                toast.error(error.error);
            } else if (typeof error === 'string') {
                toast.error(error);
            } else {
                toast.error('Failed to create account. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    // Handle Redux state changes
    useEffect(() => {
        if (status === 'failed' && error) {
            toast.error(error);
        }
    }, [status, error]);

    useEffect(() => {
        if (user) {
            if (isAdmin) {
                navigate('/admin/dashboard');
            } else {
                navigate("/")
            }
        }
    }, [user, navigate, isAdmin]);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            <ToastContainer 
                position="top-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastClassName="bg-gray-800"
                // bodyClassName="text-white"
            />
            
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
                
                {/* Right side with signup form */}
                {(!otpPage) ? (
                    <div className="flex-1 flex flex-col justify-center items-center p-8">
                        <div className="w-full max-w-md">
                            <div className="space-y-6 mb-6">
                                {/* Name and Username fields */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${
                                                name && !validateName(name) 
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
                                            }`}
                                            placeholder="Enter your name"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${
                                                username && !validateUsername(username)
                                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                                : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
                                            }`}
                                            placeholder="Enter username"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                {/* Email field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-1 transition-colors ${
                                            email && !validateEmail(email)
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-600 focus:border-green-500 focus:ring-green-500'
                                        }`}
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Create Account button */}
                                <button 
                                    className={`w-full font-semibold py-4 rounded-lg transition-colors ${
                                        isLoading 
                                        ? 'bg-gray-600 cursor-not-allowed' 
                                        : 'bg-gray-700 hover:bg-gray-600'
                                    } text-white`}
                                    onClick={requestOtp}
                                    disabled={isLoading || !name || !username || !email || !validateName(name) || !validateUsername(username) || !validateEmail(email)}
                                >
                                    {isLoading ? 'Sending OTP...' : 'Create Account'}
                                </button>
                            </div>

                            {/* Login link */}
                            <div className="text-center mb-8">
                                <span className="text-gray-400">Already have an account? </span>
                                <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">
                                    Login
                                </Link>
                            </div>

                            {/* Divider and social buttons - keep existing code */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-black text-gray-400">or</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center border">
                                        <span className="text-xs font-bold text-red-500">G</span>
                                    </div>
                                    <span className="text-sm">Sign up with Google</span>
                                </button>

                                <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                                    <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                                        <span className="text-xs font-bold text-blue-600">f</span>
                                    </div>
                                    <span className="text-sm">Sign up with Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-center items-center p-8">
                        <div className="w-full max-w-md">
                            {/* 2FA Section */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold mb-4">2 Factor Authentication</h1>
                                <p className="text-gray-400 mb-8">Check your email and enter your one-time-password.</p>

                                {/* OTP Input Boxes */}
                                <div className="flex justify-center space-x-3 mb-6">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-12 bg-transparent border-2 border-gray-600 rounded-lg text-center text-white text-lg font-semibold focus:outline-none focus:border-green-500 transition-colors"
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>

                                {/* Timer */}
                                <p className="text-gray-400 mb-4">
                                    OTP will expire in <span className="text-white font-semibold">00:{timeLeft.toString().padStart(2, '0')}</span>
                                </p>

                                {/* Resend OTP button */}
                                <button 
                                    className={`text-sm underline transition-colors ${
                                        timeLeft > 0 || isLoading
                                        ? 'text-gray-500 cursor-not-allowed' 
                                        : 'text-green-400 hover:text-green-300'
                                    }`}
                                    onClick={() => timeLeft === 0 && !isLoading && requestOtp()}
                                    disabled={timeLeft > 0 || isLoading}
                                >
                                    {isLoading ? 'Resending...' : timeLeft > 0 ? `Resend OTP (${timeLeft}s)` : 'Resend OTP'}
                                </button>
                            </div>

                            {/* Password Creation Section */}
                            <div className={`transition-all duration-500 ${showPasswordSection ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
                                {showPasswordSection && (
                                    <>
                                        {/* Success Icon */}
                                        <div className="flex justify-center mb-6">
                                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                                <Check size={32} className="text-white" />
                                            </div>
                                        </div>

                                        {/* Create Password Section */}
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold mb-6">Create Password</h2>

                                            <div className="space-y-4">
                                                {/* Password field */}
                                                <div>
                                                    <input
                                                        type="password"
                                                        placeholder="Password (minimum 6 characters)"
                                                        value={password}
                                                        onChange={(e) => setPassword(e.target.value)}
                                                        className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                                                            password && !validatePassword(password)
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-gray-600 focus:border-green-500'
                                                        }`}
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* Confirm Password field */}
                                                <div>
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm password"
                                                        value={confirmPassword}
                                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                                        className={`w-full bg-transparent border rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none transition-colors ${
                                                            confirmPassword && password !== confirmPassword
                                                            ? 'border-red-500 focus:border-red-500'
                                                            : 'border-gray-600 focus:border-green-500'
                                                        }`}
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* Create Account Button */}
                                                <button 
                                                    className={`w-full font-semibold py-3 rounded-lg transition-colors mt-6 ${
                                                        isLoading 
                                                        ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
                                                        : 'bg-white hover:bg-gray-100 text-black'
                                                    }`}
                                                    onClick={createAccount}
                                                    disabled={isLoading || !password || !confirmPassword || !validatePassword(password) || password !== confirmPassword || !validateOTP()}
                                                >
                                                    {isLoading ? 'Creating Account...' : 'Create Account'}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignupPage;

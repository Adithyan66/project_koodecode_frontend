
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/user/LandingPage'
import LoginPage from '../pages/user/LoginPage'
import SignupPage from '../pages/user/SignupPage'
import OTPPage from '../pages/user/OtpPage'
import Problems from '../pages/user/Problems'
import ProblemSolvingPage from '../pages/user/ProblemSolvingPage'


export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/otp-verification" element={<OTPPage />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problem/:id" element={<ProblemSolvingPage />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

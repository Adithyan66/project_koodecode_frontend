
import { Routes, Route } from 'react-router-dom'
import LandingPage from '../pages/user/LandingPage'
import LoginPage from '../pages/user/LoginPage'
import SignupPage from '../pages/user/SignupPage'
import ProblemsList from '../pages/user/ProblemsList'
import ProblemSolvingPage from '../pages/user/ProblemSolvingPage'


import UserProtected from "../components/protectedRoutes/UserProtected"
// import AdminProtected from '../components/protectedRoutes/AdminProtected'

import UserProfilePage from '../pages/user/UserProfilePage'
import SettingsPage from '../pages/user/SettingsPage'
import ForgotPasswordPage from '../pages/user/ForgotPasswordPage'
import GitHubCallback from '../components/user/auth/GitHubCallback'

import ContestDashboardPage from '../pages/user/ContestDashboardPage'
import ContestInfoPage from '../pages/user/ContestInfoPage'
import ContestSolvingPage from '../pages/user/ContestSolvingPage'
import RoomPage from '../pages/user/RoomPage'
import StorePage from '../pages/user/StorePage'

export default function Router() {



    return (

        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />


            <Route path="/problems" element={<UserProtected><ProblemsList /></UserProtected>} />
            <Route path="/problem/:slug" element={<UserProtected><ProblemSolvingPage /></UserProtected>} />

            <Route path="/profile" element={<UserProtected><UserProfilePage /></UserProtected>} />
            <Route path="/settings" element={<UserProtected><SettingsPage /></UserProtected>} />

            <Route path="/contests" element={<UserProtected><ContestDashboardPage /></UserProtected>} />
            <Route path="/contest/:contestNumber" element={<UserProtected><ContestInfoPage /></UserProtected>} />
            <Route path="/contest/:contestNumber/participate" element={<UserProtected><ContestSolvingPage /></UserProtected>} />
            <Route path="/room/:roomId" element={<UserProtected><RoomPage /></UserProtected>} />

            <Route path="/store" element={<UserProtected><StorePage /></UserProtected>} />

        </Routes>
    )
}



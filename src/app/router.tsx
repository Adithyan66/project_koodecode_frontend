
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/user/LandingPage'
import LoginPage from '../pages/user/LoginPage'
import SignupPage from '../pages/user/SignupPage'
import Problems from '../pages/user/Problems'
import ProblemSolvingPage from '../pages/user/ProblemSolvingPage'

import { useAppSelector } from './hooks'
import React, { useEffect } from 'react'

import UserProtected from "../components/protectedRoutes/UserProtected"
import AdminProtected from '../components/protectedRoutes/AdminProtected'
import ProblemListingPage from '../pages/admin/ProblemListingPage'
import { DashboardPage } from '../pages/admin/DashboardPage'
import AddProblemPage from '../pages/admin/AddProblemPage'
import UserProfilePage from '../pages/user/UserProfilePage'
import SettingsPage from '../pages/user/SettingsPage'
import ForgotPasswordPage from '../pages/user/ForgotPasswordPage'
import GitHubCallback from '../components/user/auth/GitHubCallback'
import { ContestListing } from '../components/admin/contests/contestListing/ContestListing'
import ContestListingPage from '../pages/admin/ContestListingPage'
import CreateContestPage from '../pages/admin/CreateContestPage'
import ContestDashboardPage from '../pages/user/ContestDashboardPage'
import ContestInfoPage from '../pages/user/ContestInfoPage'
import ContestSolvingPage from '../pages/user/ContestSolvingPage'
import RoomPage from '../pages/user/RoomPage'
import StorePage from '../pages/user/StorePage'
// import ExcalidrawPage from '../pages/user/ExcailDrawPAge'

export default function Router() {



    return (

        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />


            <Route path="/problems" element={<UserProtected><Problems /></UserProtected>} />
            <Route path="/problem/:slug" element={<UserProtected><ProblemSolvingPage /></UserProtected>} />

            <Route path="/profile" element={<UserProtected><UserProfilePage /></UserProtected>} />
            <Route path="/settings" element={<UserProtected><SettingsPage /></UserProtected>} />

            <Route path="/contests" element={<UserProtected><ContestDashboardPage /></UserProtected>} />
            <Route path="/contest/:contestNumber" element={<UserProtected><ContestInfoPage /></UserProtected>} />
            <Route path="/contest/:contestNumber/participate" element={<UserProtected><ContestSolvingPage /></UserProtected>} />
            <Route path="/room/:roomId" element={<UserProtected><RoomPage /></UserProtected>} />

            <Route path="/store" element={<UserProtected><StorePage /></UserProtected>} />

            {/* <Route path="/exc" element={<ExcalidrawPage />} /> */}


            <Route path="/admin/dashboard" element={<AdminProtected> <DashboardPage /></AdminProtected>} />
            <Route path="/admin/problems" element={<AdminProtected> <ProblemListingPage /></AdminProtected>} />
            <Route path="/admin/problems/addProblem" element={<AdminProtected> <AddProblemPage /></AdminProtected>} />
            <Route path="/admin/contests" element={<AdminProtected> <ContestListingPage /></AdminProtected>} />
            <Route path="/admin/contests/create-contest" element={<AdminProtected> <CreateContestPage /></AdminProtected>} />
            <Route path="/admin/*" element={<AdminProtected> <DashboardPage /></AdminProtected>} />
        </Routes>
    )
}




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

export default function Router() {



    return (

        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />


            <Route path="/problems" element={<UserProtected><Problems /></UserProtected>} />
            <Route path="/problem/:problemId" element={<UserProtected><ProblemSolvingPage /></UserProtected>} />

            <Route path="/profile" element={<UserProtected><UserProfilePage /></UserProtected>} />
            <Route path="/settings" element={<UserProtected><SettingsPage /></UserProtected>} />


            <Route path="/admin/dashboard" element={<AdminProtected> <DashboardPage /></AdminProtected>} />
            <Route path="/admin/problems" element={<AdminProtected> <ProblemListingPage /></AdminProtected>} />
            <Route path="/admin/problems/addProblem" element={<AdminProtected> <AddProblemPage /></AdminProtected>} />
            <Route path="/admin/*" element={<AdminProtected> <DashboardPage /></AdminProtected>} />
        </Routes>
    )
}



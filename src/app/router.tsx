
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/user/LandingPage'
import LoginPage from '../pages/user/LoginPage'
import SignupPage from '../pages/user/SignupPage'
import Problems from '../pages/user/Problems'
import ProblemSolvingPage from '../pages/user/ProblemSolvingPage'

import { useAppSelector } from './hooks'
import React from 'react'

import UserProtected from "../components/protectedRoutes/UserProtected"
import AdminProtected from '../components/protectedRoutes/AdminProtected'
import ProblemListingPage from '../pages/admin/ProblemListingPage'
import { DashboardPage } from '../pages/admin/DashboardPage'

export default function Router() {

    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true);

    console.log("isAuthenticated:",);

    return (

        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />


            <Route path="/problems" element={<UserProtected><Problems /></UserProtected>} />
            <Route path="/problem/:id" element={<UserProtected><ProblemSolvingPage /></UserProtected>} />



            <Route path="/admin/dashboard" element={<AdminProtected> <DashboardPage /></AdminProtected>} />
            <Route path="/admin/problems" element={<AdminProtected> <ProblemListingPage /></AdminProtected>} />
        </Routes>


    )
}



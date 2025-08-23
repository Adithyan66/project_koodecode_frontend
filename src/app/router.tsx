
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/user/LandingPage'
import LoginPage from '../pages/user/LoginPage'
import SignupPage from '../pages/user/SignupPage'
import Problems from '../pages/user/Problems'
import ProblemSolvingPage from '../pages/user/ProblemSolvingPage'

import { useAppSelector } from './hooks'
import React from 'react'

import UserProtected from "../components/protectedRoutes/UserProtected"

export default function Router() {

    const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

    const isAdmin = useAppSelector(state => state.user.user?.isAdmin === true);

    console.log("isAuthenticated:", isAdmin);

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="/*" element={

                (isAuthenticated && !isAdmin) ? (

                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Route path="/problems" element={<UserProtected><Problems /></UserProtected>} />
                        <Route path="/problem/:id" element={<UserProtected><ProblemSolvingPage /></UserProtected>} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </React.Suspense>

                )
                    : (
                        <Navigate to="/login" />
                    )
            } />






            < Route path="/admin/*" element={
                isAuthenticated ? (
                    <React.Suspense fallback={< div > Loading...</div>}>
                        <h1>Admin Panel - Under Construction</h1>
                    </React.Suspense >
                ) : (
                    <Navigate to="/login" />
                )
            } />

        </Routes >
    )
}

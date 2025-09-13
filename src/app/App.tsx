import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./router"
import { useAppDispatch } from "./hooks"
import { initializeAuth } from "../features/auth/userThunks"
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';



function App() {

  const dispatch = useAppDispatch()

  useEffect(() => {

    dispatch(initializeAuth());

  }, [dispatch]);



  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>

          <Router />

        </BrowserRouter>
      </GoogleOAuthProvider>
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar />
    </>
  )
}

export default App


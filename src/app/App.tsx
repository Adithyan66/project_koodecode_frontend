import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./router"
import { useAppDispatch } from "./hooks"
import { initializeAuth } from "../features/auth/userThunks"
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { registerServiceWorker } from "../utils/pushNotifications";



function App() {

  const dispatch = useAppDispatch()

  useEffect(() => {

    dispatch(initializeAuth());

  }, [dispatch]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      registerServiceWorker().catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
    }
  }, []);



  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>

          <Router />

        </BrowserRouter>
      </GoogleOAuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        style={{ width: "auto", marginTop: "28px" }}
        toastStyle={{ whiteSpace: "nowrap", width: "max-content", maxWidth: "80vw", minWidth: "unset" }}
      />
    </>
  )
}

export default App


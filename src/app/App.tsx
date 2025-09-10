import { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import Router from "./router"
import { useAppDispatch } from "./hooks"
import { initializeAuth } from "../features/auth/userThunks"
import { ToastContainer } from 'react-toastify';



function App() {

  const dispatch = useAppDispatch()

  useEffect(() => {

    dispatch(initializeAuth());

  }, [dispatch]);



  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar />
    </>
  )
}

export default App


import React, { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import Router from "./router"
import httpClient from "../services/axios/httpClient"
import { useAppDispatch, useAppSelector } from "./hooks"
import { initializeAuth } from "../features/auth/userThunks"
import { ToastContainer, toast } from 'react-toastify';



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


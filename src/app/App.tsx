import React, { useEffect } from "react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import Router from "./router"
import httpClient from "../services/axios/httpClient"
import { useAppDispatch, useAppSelector } from "./hooks"
import { initializeAuth } from "../features/auth/userThunks"



function App() {

  const dispatch = useAppDispatch()

  // const { isInitialized, isAuthenticated } = useAppSelector((state) => state.user);


  useEffect(() => {

    dispatch(initializeAuth());

  }, [dispatch]);



  return (

    <BrowserRouter>
      <Router />
    </BrowserRouter>

  )
}

export default App


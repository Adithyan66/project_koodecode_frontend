import React from "react"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./store"
import Router from "./router"



function App() {

  return (
    <Provider store={store}  >

      <BrowserRouter>
        <Router />
      </BrowserRouter>

    </Provider>

  )
}

export default App


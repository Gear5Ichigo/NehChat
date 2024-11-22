import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { SignUp } from './pages/signup'
import { Home } from './pages/home'
import { Dashboard } from './pages/dashbaord'
import { AllChat } from './pages/allchat'
import { Settings } from './pages/settings'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect( () => {
    fetch('/api/authenticate')
    .then( res => res.json() )
    .then( res => {
      res.data ? setLoggedIn(true) : setLoggedIn(false)
      console.log(loggedIn)
    })
    return () => {

    }
  }, [] )

  const isAuth = () => {
    console.log(loggedIn)
    return loggedIn
  }

  return (
    <>
      <Router>
        <Routes>
          <Route index path='/' element={<Home/>}/>
          <Route exact path='/signup' element={<SignUp/>}/>
          <Route exact path='/dashboard' element={ <Dashboard/> } />
          <Route exact path='/settings' element={ <Settings/> } />
          <Route exact path='/allchat' element={<AllChat/>} />
        </Routes>
      </Router>
    </>
  )

}

export default App

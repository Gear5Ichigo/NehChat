import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { SignUp } from './Pages/signup'
import { Home } from './Pages/home'
import { TopNav } from './Components/TopNav'
import { Dashboard } from './Pages/dashbaord'
import { useEffect, useState } from 'react'

import Button from 'react-bootstrap/Button'
import { AllChat } from './Pages/allchat'

function App() {
  const [userTheme, setUserTheme] = useState('light')

  const df = async () => {
    fetch("/api/theme?theme="+userTheme).then(
      res => res.json()
    ).then(
      data => {
        setUserTheme(data.theme)
        document.querySelector('html').dataset.bsTheme = data.theme
      }
    )
  }

  return (
    <>
      <TopNav/>
      <Router>
        <Routes>
          <Route index path='/' element={<Home/>}/>
          <Route exact path='/signup' element={<SignUp/>}/>
          <Route exact path='/dashboard' element={<Dashboard/>} />
          <Route exact path='/allchat' element={<AllChat/>} />
        </Routes>
      </Router>
      <Button onClick={df} className='position-absolute bottom-0 end-0'> {userTheme} </Button>
    </>
  )

}

export default App

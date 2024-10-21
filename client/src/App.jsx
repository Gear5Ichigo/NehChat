import './App.css'

import { HashRouter as Router, Routes, Route } from 'react-router-dom'

import { LogIn } from './Pages/login'
import { Home } from './Pages/home'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<LogIn/>} />
      </Routes>
    </Router>
  )

}

export default App

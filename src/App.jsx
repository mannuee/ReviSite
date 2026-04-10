import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Fiches from './pages/Fiches'
import FicheDetail from './pages/FicheDetail'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fiches" element={<Fiches />} />
        <Route path="/fiche/:id" element={<FicheDetail />} />
      </Routes>
    </div>
  )
}

export default App
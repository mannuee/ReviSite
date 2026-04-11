import { Link } from 'react-router-dom'

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <h2>📚 Notely</h2>

      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/fiches">Fiches</Link>

        
      </div>
    </nav>
  )
}

export default Navbar
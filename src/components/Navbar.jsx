import { Link } from 'react-router-dom'

function Navbar({ darkMode, setDarkMode }) {
  return (
    <nav className="navbar">
      <h2>📚 RéviSite</h2>

      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/fiches">Fiches</Link>

        <button
          className="dark-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </nav>
  )
}

export default Navbar
import { Link } from 'react-router-dom'

function Home() {
  return (
    <main className="home">
      <section className="hero">
        <h1>Révise plus facilement avec RéviSite</h1>
        <p>
          Une plateforme de fiches de révision claires, organisées et
          interactives pour apprendre plus efficacement.
        </p>
        <Link to="/fiches" className="hero-button">
          Voir les fiches
        </Link>
      </section>

      <section className="features">
        <div className="feature-card">
          <h2>📚 Fiches organisées</h2>
          <p>
            Retrouve rapidement tes fiches par matière et révise de façon plus structurée.
          </p>
        </div>

        <div className="feature-card">
          <h2>🔍 Recherche rapide</h2>
          <p>
            Utilise la barre de recherche pour trouver directement la fiche dont tu as besoin.
          </p>
        </div>

        <div className="feature-card">
          <h2>🎯 Révision efficace</h2>
          <p>
            Concentre-toi sur l’essentiel grâce à des contenus simples, lisibles et accessibles.
          </p>
        </div>
      </section>
    </main>
  )
}

export default Home
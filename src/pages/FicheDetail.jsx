import { useParams, Link } from 'react-router-dom'
import fiches from '../data/fiches'

function FicheDetail() {
  const { id } = useParams()
  const fiche = fiches.find((f) => f.id === Number(id))

  if (!fiche) {
    return (
      <main>
        <h1>Fiche introuvable</h1>
        <Link to="/fiches">Retour aux fiches</Link>
      </main>
    )
  }

  return (
    <main>
      <Link to="/fiches" className="retour">← Retour aux fiches</Link>

      <div className="detail-card">
        <h1>{fiche.titre}</h1>
        <p><strong>Matière :</strong> {fiche.matiere}</p>
        <p><strong>Niveau :</strong> {fiche.niveau}</p>
        <p><strong>Résumé :</strong> {fiche.resume}</p>

        <div className="contenu-fiche">
          <h2>Contenu</h2>
          <p>{fiche.contenu}</p>
        </div>
      </div>
    </main>
  )
}

export default FicheDetail
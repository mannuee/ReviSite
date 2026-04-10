import { Link } from 'react-router-dom'

function FicheCard({ fiche }) {
  return (
    <div className="card">
      <h2>{fiche.titre}</h2>
      <p><strong>Matière :</strong> {fiche.matiere}</p>
      <p><strong>Niveau :</strong> {fiche.niveau}</p>
      <p>{fiche.resume}</p>

      <Link to={`/fiche/${fiche.id}`} className="btn-details">
        Voir
      </Link>
    </div>
  )
}

export default FicheCard
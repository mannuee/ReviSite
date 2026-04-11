import { Link } from 'react-router-dom'

function FicheCard({ fiche, onEdit, onDelete }) {
  return (
    <div className="card">

      {/* Boutons en haut à droite */}
      <div className="card-top-actions">
        <button
          className="icon-btn edit"
          onClick={() => onEdit(fiche)}
          title="Modifier"
        >
          ✏️
        </button>

        <button
          className="icon-btn delete"
          onClick={() => onDelete(fiche.id)}
          title="Supprimer"
        >
          🗑️
        </button>
      </div>

      <h2>{fiche.titre}</h2>
      <p><strong>Matière :</strong> {fiche.matiere}</p>
      <p><strong>Niveau :</strong> {fiche.niveau}</p>
      <p>{fiche.resume}</p>

      {fiche.fichier_url && (
        <p>
          <a
            href={`http://localhost:5000${fiche.fichier_url}`}
            target="_blank"
            rel="noreferrer"
          >
            📎 Voir fichier
          </a>
        </p>
      )}

      <Link to={`/fiche/${fiche.id}`} className="btn-details">
        Voir
      </Link>
    </div>
  )
}

export default FicheCard
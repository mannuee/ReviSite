import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_URL } from '../config'

function FicheDetail() {
  const { id } = useParams()
  const [fiche, setFiche] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function chargerFiche() {
      try {
        const response = await fetch(`${API_URL}/fiches/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Erreur chargement fiche')
        }

        setFiche(data)
      } catch (error) {
        console.error('Erreur chargement fiche :', error)
        setFiche(null)
      } finally {
        setLoading(false)
      }
    }

    chargerFiche()
  }, [id])

  if (loading) {
    return (
      <main>
        <p>Chargement...</p>
      </main>
    )
  }

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

        {fiche.fichier_url && (
          <p>
            <strong>Fichier :</strong>{' '}
            <a
              href={`${API_URL}${fiche.fichier_url}`}
              target="_blank"
              rel="noreferrer"
            >
              {fiche.fichier_nom || 'Voir le fichier'}
            </a>
          </p>
        )}

        <div className="contenu-fiche">
          <h2>Contenu</h2>
          <p>{fiche.contenu}</p>
        </div>
      </div>
    </main>
  )
}

export default FicheDetail
import { useEffect, useState } from 'react'
import FicheCard from '../components/FicheCard'

function Fiches() {
  const [fiches, setFiches] = useState([])
  const [recherche, setRecherche] = useState('')
  const [matiereSelectionnee, setMatiereSelectionnee] = useState('Toutes')
  const [afficherFormulaire, setAfficherFormulaire] = useState(false)
  const [ficheEnCoursEdition, setFicheEnCoursEdition] = useState(null)
  const [message, setMessage] = useState('')

  const [titre, setTitre] = useState('')
  const [matiere, setMatiere] = useState('')
  const [niveau, setNiveau] = useState('')
  const [resume, setResume] = useState('')
  const [contenu, setContenu] = useState('')
  const [fichier, setFichier] = useState(null)

  useEffect(() => {
    chargerFiches()
  }, [])

  async function chargerFiches() {
    try {
      const response = await fetch('http://localhost:5000/fiches')
      const data = await response.json()
      setFiches(data)
    } catch (error) {
      console.error('Erreur chargement fiches :', error)
    }
  }

  function resetFormulaire() {
    setTitre('')
    setMatiere('')
    setNiveau('')
    setResume('')
    setContenu('')
    setFichier(null)
    setFicheEnCoursEdition(null)
  }

  function afficherMessage(texte) {
    setMessage(texte)
    setTimeout(() => {
      setMessage('')
    }, 3000)
  }

  function commencerEdition(fiche) {
    setTitre(fiche.titre)
    setMatiere(fiche.matiere)
    setNiveau(fiche.niveau)
    setResume(fiche.resume)
    setContenu(fiche.contenu)
    setFichier(null)
    setFicheEnCoursEdition(fiche)
    setAfficherFormulaire(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function supprimerFiche(id) {
    const confirmation = window.confirm('Voulez-vous vraiment supprimer cette fiche ?')

    if (!confirmation) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/fiches/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la suppression')
      }

      setFiches(fiches.filter((fiche) => fiche.id !== id))
      afficherMessage('✅ Fiche supprimée avec succès.')
    } catch (error) {
      console.error('Erreur suppression fiche :', error)
      alert('Erreur lors de la suppression de la fiche.')
    }
  }

  const matieres = ['Toutes', ...new Set(fiches.map((fiche) => fiche.matiere))]

  const fichesFiltrees = fiches.filter((fiche) => {
    const correspondRecherche =
      fiche.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      fiche.matiere.toLowerCase().includes(recherche.toLowerCase()) ||
      fiche.resume.toLowerCase().includes(recherche.toLowerCase())

    const correspondMatiere =
      matiereSelectionnee === 'Toutes' || fiche.matiere === matiereSelectionnee

    return correspondRecherche && correspondMatiere
  })

  async function ajouterOuModifierFiche(e) {
    e.preventDefault()

    if (!titre || !matiere || !niveau || !resume || !contenu) {
      alert('Merci de remplir tous les champs.')
      return
    }

    const formData = new FormData()
    formData.append('titre', titre)
    formData.append('matiere', matiere)
    formData.append('niveau', niveau)
    formData.append('resume', resume)
    formData.append('contenu', contenu)

    if (fichier) {
      formData.append('fichier', fichier)
    }

    try {
      const estEdition = ficheEnCoursEdition !== null
      const url = estEdition
        ? `http://localhost:5000/fiches/${ficheEnCoursEdition.id}`
        : 'http://localhost:5000/fiches'

      const method = estEdition ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’enregistrement')
      }

      if (estEdition) {
        setFiches(
          fiches.map((fiche) =>
            fiche.id === ficheEnCoursEdition.id ? data : fiche
          )
        )
        afficherMessage('✅ Fiche modifiée avec succès.')
      } else {
        setFiches([data, ...fiches])
        afficherMessage('✅ Fiche ajoutée avec succès.')
      }

      resetFormulaire()
      setAfficherFormulaire(false)
    } catch (error) {
      console.error('Erreur ajout/modification fiche :', error)
      alert('Erreur lors de l’enregistrement de la fiche.')
    }
  }

  return (
    <main>
      <h1>📚 Toutes les fiches</h1>

      {message && <p className="success-msg">{message}</p>}

      <button
        className="toggle-btn"
        onClick={() => {
          if (afficherFormulaire) {
            setAfficherFormulaire(false)
            resetFormulaire()
          } else {
            setAfficherFormulaire(true)
          }
        }}
      >
        {afficherFormulaire
          ? 'Fermer'
          : ficheEnCoursEdition
            ? 'Modifier la fiche'
            : '+ Ajouter une fiche'}
      </button>

      {afficherFormulaire && (
        <section className="form-section">
          <h2>
            {ficheEnCoursEdition ? 'Modifier une fiche' : 'Ajouter une fiche'}
          </h2>

          <form className="fiche-form" onSubmit={ajouterOuModifierFiche} autoComplete="off">
            <input
              type="text"
              placeholder="Titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
            />

            <input
              type="text"
              placeholder="Matière"
              value={matiere}
              onChange={(e) => setMatiere(e.target.value)}
            />

            <input
              type="text"
              placeholder="Niveau"
              value={niveau}
              onChange={(e) => setNiveau(e.target.value)}
            />

            <input
              type="text"
              placeholder="Résumé"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />

            <textarea
              placeholder="Contenu complet de la fiche"
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
            />

            <label className="file-label">
              📎 Joindre un fichier
              <input
                type="file"
                onChange={(e) => setFichier(e.target.files[0])}
              />
            </label>

            {fichier && <p className="file-name">📄 {fichier.name}</p>}

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {ficheEnCoursEdition
                  ? 'Enregistrer les modifications'
                  : 'Ajouter la fiche'}
              </button>

              {ficheEnCoursEdition && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    resetFormulaire()
                    setAfficherFormulaire(false)
                  }}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </section>
      )}

      <div className="filtres">
        <input
          type="text"
          placeholder="Rechercher une fiche..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        <select
          value={matiereSelectionnee}
          onChange={(e) => setMatiereSelectionnee(e.target.value)}
        >
          {matieres.map((matiereOption) => (
            <option key={matiereOption} value={matiereOption}>
              {matiereOption}
            </option>
          ))}
        </select>
      </div>

      {fichesFiltrees.length > 0 ? (
        fichesFiltrees.map((fiche) => (
          <FicheCard
            key={fiche.id}
            fiche={fiche}
            onEdit={commencerEdition}
            onDelete={supprimerFiche}
          />
        ))
      ) : (
        <p>Aucune fiche trouvée.</p>
      )}
    </main>
  )
}

export default Fiches
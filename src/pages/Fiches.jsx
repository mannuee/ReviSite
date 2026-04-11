import { useEffect, useState } from 'react'
import FicheCard from '../components/FicheCard'
import { API_URL } from '../config'

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
    const response = await fetch(`${API_URL}/fiches`)
    const data = await response.json()
    setFiches(data)
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

  function afficherMessage(msg) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3000)
  }

  function commencerEdition(fiche) {
    setTitre(fiche.titre)
    setMatiere(fiche.matiere)
    setNiveau(fiche.niveau)
    setResume(fiche.resume)
    setContenu(fiche.contenu)
    setFicheEnCoursEdition(fiche)
    setAfficherFormulaire(true)
  }

  async function supprimerFiche(id) {
    if (!confirm('Supprimer cette fiche ?')) return

    await fetch(`${API_URL}/fiches/${id}`, {
      method: 'DELETE',
    })

    setFiches(fiches.filter((f) => f.id !== id))
    afficherMessage('🗑️ Fiche supprimée')
  }

  async function ajouterOuModifierFiche(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append('titre', titre)
    formData.append('matiere', matiere)
    formData.append('niveau', niveau)
    formData.append('resume', resume)
    formData.append('contenu', contenu)

    if (fichier) formData.append('fichier', fichier)

    const isEdit = ficheEnCoursEdition

    const url = isEdit
      ? `${API_URL}/fiches/${ficheEnCoursEdition.id}`
      : `${API_URL}/fiches`

    const method = isEdit ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      body: formData,
    })

    const data = await response.json()

    if (isEdit) {
      setFiches(fiches.map(f => f.id === data.id ? data : f))
      afficherMessage('✏️ Fiche modifiée')
    } else {
      setFiches([data, ...fiches])
      afficherMessage('✅ Fiche ajoutée')
    }

    resetFormulaire()
    setAfficherFormulaire(false)
  }

  const matieres = ['Toutes', ...new Set(fiches.map(f => f.matiere))]

  const fichesFiltrees = fiches.filter(f =>
    (f.titre.toLowerCase().includes(recherche.toLowerCase()) ||
     f.resume.toLowerCase().includes(recherche.toLowerCase())) &&
    (matiereSelectionnee === 'Toutes' || f.matiere === matiereSelectionnee)
  )

  return (
    <main>
      <h1>📚 Fiches</h1>

      {message && <p className="success-msg">{message}</p>}

      <button onClick={() => setAfficherFormulaire(!afficherFormulaire)}>
        {afficherFormulaire ? 'Fermer' : '+ Ajouter'}
      </button>

      {afficherFormulaire && (
        <form onSubmit={ajouterOuModifierFiche}>
          <input placeholder="Titre" value={titre} onChange={e => setTitre(e.target.value)} />
          <input placeholder="Matière" value={matiere} onChange={e => setMatiere(e.target.value)} />
          <input placeholder="Niveau" value={niveau} onChange={e => setNiveau(e.target.value)} />
          <input placeholder="Résumé" value={resume} onChange={e => setResume(e.target.value)} />
          <textarea placeholder="Contenu" value={contenu} onChange={e => setContenu(e.target.value)} />

          <label className="file-label">
            📎 Joindre un fichier
            <input type="file" onChange={e => setFichier(e.target.files[0])} />
          </label>

          <button type="submit">
            {ficheEnCoursEdition ? 'Modifier' : 'Ajouter'}
          </button>
        </form>
      )}

      <input
        placeholder="Rechercher..."
        value={recherche}
        onChange={e => setRecherche(e.target.value)}
      />

      <select onChange={e => setMatiereSelectionnee(e.target.value)}>
        {matieres.map(m => <option key={m}>{m}</option>)}
      </select>

      {fichesFiltrees.map(fiche => (
        <FicheCard
          key={fiche.id}
          fiche={fiche}
          onEdit={commencerEdition}
          onDelete={supprimerFiche}
        />
      ))}
    </main>
  )
}

export default Fiches
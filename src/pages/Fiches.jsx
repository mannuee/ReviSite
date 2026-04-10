import { useEffect, useState } from 'react'
import fichesData from '../data/fiches'
import FicheCard from '../components/FicheCard'

function Fiches() {
  // 📦 State des fiches (avec localStorage)
  const [fiches, setFiches] = useState(() => {
    const fichesSauvegardees = localStorage.getItem('fiches')
    return fichesSauvegardees ? JSON.parse(fichesSauvegardees) : fichesData
  })

  // 🔍 Recherche + filtre
  const [recherche, setRecherche] = useState('')
  const [matiereSelectionnee, setMatiereSelectionnee] = useState('Toutes')

  // 👁️ Formulaire affiché ou non
  const [afficherFormulaire, setAfficherFormulaire] = useState(false)

  // 📝 Champs du formulaire
  const [titre, setTitre] = useState('')
  const [matiere, setMatiere] = useState('')
  const [niveau, setNiveau] = useState('')
  const [resume, setResume] = useState('')
  const [contenu, setContenu] = useState('')

  // 💾 Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem('fiches', JSON.stringify(fiches))
  }, [fiches])

  // 📚 Liste des matières
  const matieres = ['Toutes', ...new Set(fiches.map((fiche) => fiche.matiere))]

  // 🔎 Filtrage
  const fichesFiltrees = fiches.filter((fiche) => {
    const correspondRecherche =
      fiche.titre.toLowerCase().includes(recherche.toLowerCase()) ||
      fiche.matiere.toLowerCase().includes(recherche.toLowerCase()) ||
      fiche.resume.toLowerCase().includes(recherche.toLowerCase())

    const correspondMatiere =
      matiereSelectionnee === 'Toutes' || fiche.matiere === matiereSelectionnee

    return correspondRecherche && correspondMatiere
  })

  // ➕ Ajouter une fiche
  function ajouterFiche(e) {
    e.preventDefault()

    if (!titre || !matiere || !niveau || !resume || !contenu) {
      alert('Merci de remplir tous les champs.')
      return
    }

    const nouvelleFiche = {
      id: Date.now(),
      titre,
      matiere,
      niveau,
      resume,
      contenu,
    }

    setFiches([nouvelleFiche, ...fiches])

    // reset
    setTitre('')
    setMatiere('')
    setNiveau('')
    setResume('')
    setContenu('')
    setAfficherFormulaire(false)
  }

  return (
    <main>
      <h1>📚 Toutes les fiches</h1>

      {/* 🔘 Bouton afficher formulaire */}
      <button
        className="toggle-btn"
        onClick={() => setAfficherFormulaire(!afficherFormulaire)}
      >
        {afficherFormulaire ? 'Fermer' : '+ Ajouter une fiche'}
      </button>

      {/* 📝 Formulaire */}
      {afficherFormulaire && (
        <section className="form-section">
          <h2>Ajouter une fiche</h2>

          <form className="fiche-form" onSubmit={ajouterFiche} autoComplete="off">
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

            <button type="submit" className="submit-btn">
              Ajouter la fiche
            </button>
          </form>
        </section>
      )}

      {/* 🔍 Filtres */}
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
          {matieres.map((matiere) => (
            <option key={matiere} value={matiere}>
              {matiere}
            </option>
          ))}
        </select>
      </div>

      {/* 📄 Liste des fiches */}
      {fichesFiltrees.length > 0 ? (
        fichesFiltrees.map((fiche) => (
          <FicheCard
            key={fiche.id}
            fiche={fiche}
          />
        ))
      ) : (
        <p>Aucune fiche trouvée.</p>
      )}
    </main>
  )
}

export default Fiches              
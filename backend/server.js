const express = require('express')
const cors = require('cors')
const db = require('./database')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 5000

const uploadDir = path.join(__dirname, 'uploads')

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname
    cb(null, uniqueName)
  },
})

const upload = multer({ storage })

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(uploadDir))

app.get('/', (req, res) => {
  res.send('API RéviSite en ligne')
})

app.get('/fiches', (req, res) => {
  db.all('SELECT * FROM fiches ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    res.json(rows)
  })
})

app.get('/fiches/:id', (req, res) => {
  const { id } = req.params

  db.get('SELECT * FROM fiches WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (!row) {
      return res.status(404).json({ error: 'Fiche introuvable.' })
    }

    res.json(row)
  })
})

app.post('/fiches', upload.single('fichier'), (req, res) => {
  const { titre, matiere, niveau, resume, contenu } = req.body

  if (!titre || !matiere || !niveau || !resume || !contenu) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' })
  }

  const fichierNom = req.file ? req.file.originalname : null
  const fichierUrl = req.file ? `/uploads/${req.file.filename}` : null

  const sql = `
    INSERT INTO fiches (titre, matiere, niveau, resume, contenu, fichier_nom, fichier_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

  db.run(
    sql,
    [titre, matiere, niveau, resume, contenu, fichierNom, fichierUrl],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message })
      }

      res.status(201).json({
        id: this.lastID,
        titre,
        matiere,
        niveau,
        resume,
        contenu,
        fichier_nom: fichierNom,
        fichier_url: fichierUrl,
      })
    }
  )
})

app.put('/fiches/:id', upload.single('fichier'), (req, res) => {
  const { id } = req.params
  const { titre, matiere, niveau, resume, contenu } = req.body

  if (!titre || !matiere || !niveau || !resume || !contenu) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' })
  }

  db.get('SELECT * FROM fiches WHERE id = ?', [id], (err, ficheExistante) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (!ficheExistante) {
      return res.status(404).json({ error: 'Fiche introuvable.' })
    }

    let fichierNom = ficheExistante.fichier_nom
    let fichierUrl = ficheExistante.fichier_url

    if (req.file) {
      fichierNom = req.file.originalname
      fichierUrl = `/uploads/${req.file.filename}`
    }

    const sql = `
      UPDATE fiches
      SET titre = ?, matiere = ?, niveau = ?, resume = ?, contenu = ?, fichier_nom = ?, fichier_url = ?
      WHERE id = ?
    `

    db.run(
      sql,
      [titre, matiere, niveau, resume, contenu, fichierNom, fichierUrl, id],
      function (updateErr) {
        if (updateErr) {
          return res.status(500).json({ error: updateErr.message })
        }

        res.json({
          id: Number(id),
          titre,
          matiere,
          niveau,
          resume,
          contenu,
          fichier_nom: fichierNom,
          fichier_url: fichierUrl,
        })
      }
    )
  })
})

app.delete('/fiches/:id', (req, res) => {
  const { id } = req.params

  db.get('SELECT * FROM fiches WHERE id = ?', [id], (err, fiche) => {
    if (err) {
      return res.status(500).json({ error: err.message })
    }

    if (!fiche) {
      return res.status(404).json({ error: 'Fiche introuvable.' })
    }

    if (fiche.fichier_url) {
      const filePath = path.join(__dirname, fiche.fichier_url.replace('/uploads/', 'uploads/'))
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    db.run('DELETE FROM fiches WHERE id = ?', [id], function (deleteErr) {
      if (deleteErr) {
        return res.status(500).json({ error: deleteErr.message })
      }

      res.json({ message: 'Fiche supprimée avec succès.' })
    })
  })
})

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`)
})
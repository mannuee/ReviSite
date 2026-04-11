const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, 'database.sqlite')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur connexion SQLite :', err.message)
  } else {
    console.log('Connecté à SQLite')
  }
})

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS fiches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      matiere TEXT NOT NULL,
      niveau TEXT NOT NULL,
      resume TEXT NOT NULL,
      contenu TEXT NOT NULL,
      fichier_nom TEXT,
      fichier_url TEXT
    )
  `)
})

module.exports = db
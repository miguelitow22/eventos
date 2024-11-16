const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los torneos
router.get('/', (req, res) => {
  db.query('SELECT * FROM torneos', (err, results) => {
    if (err) {
      console.error('Error obteniendo los torneos:', err);
      return res.status(500).json({ error: 'Error al obtener los torneos' });
    }
    res.status(200).json(results);
  });
});

// Inscripción a un torneo
router.post('/inscripcion', (req, res) => {
  const { usuario_id, torneo_id } = req.body;

  db.query('INSERT INTO inscripciones (usuario_id, torneo_id) VALUES (?, ?)', [usuario_id, torneo_id], (err, results) => {
    if (err) {
      console.error('Error al inscribir al torneo:', err);
      return res.status(500).json({ error: 'Error al inscribir al torneo' });
    }
    res.status(200).json({ message: 'Inscripción exitosa' });
  });
});

module.exports = router;

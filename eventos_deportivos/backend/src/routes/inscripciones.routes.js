const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las inscripciones de un usuario
router.get('/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;
    db.query(
        'SELECT * FROM inscripciones WHERE usuario_id = ?',
        [id_usuario],
        (err, results) => {
            if (err) {
                console.error('Error obteniendo inscripciones:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(results);
        }
    );
});

// Inscribir a un usuario en un torneo
router.post('/', (req, res) => {
    const { usuario_id, torneo_id } = req.body;
    db.query(
        'INSERT INTO inscripciones (usuario_id, torneo_id) VALUES (?, ?)',
        [usuario_id, torneo_id],
        (err, results) => {
            if (err) {
                console.error('Error inscribiendo usuario:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: results.insertId, usuario_id, torneo_id });
        }
    );
});

// Eliminar inscripción
router.delete('/:usuario_id/:torneo_id', (req, res) => {
    const { usuario_id, torneo_id } = req.params;
    db.query(
        'DELETE FROM inscripciones WHERE usuario_id = ? AND torneo_id = ?',
        [usuario_id, torneo_id],
        (err) => {
            if (err) {
                console.error('Error eliminando inscripción:', err);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Inscripción eliminada correctamente' });
        }
    );
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los partidos de un torneo
router.get('/:id_torneo', (req, res) => {
    const { id_torneo } = req.params; // Extrae el id del torneo de los parámetros
    db.query(
        'SELECT * FROM partidos WHERE torneo_id = ?',
        [id_torneo], // Pasamos el id_torneo como parámetro en la consulta SQL
        (err, results) => {
            if (err) {
                console.error('Error obteniendo partidos:', err);
                return res.status(500).json({ error: err.message }); // Devuelve un error si no se pueden obtener los partidos
            }
            res.status(200).json(results); // Si todo va bien, devuelve los partidos
        }
    );
});

// Crear un nuevo partido
router.post('/', (req, res) => {
    const { equipo_local, equipo_visitante, torneo_id, fecha } = req.body; // Extrae los datos del partido desde el cuerpo de la solicitud
    db.query(
        'INSERT INTO partidos (equipo_local, equipo_visitante, torneo_id, fecha) VALUES (?, ?, ?, ?)',
        [equipo_local, equipo_visitante, torneo_id, fecha], // Inserta el nuevo partido en la base de datos
        (err, results) => {
            if (err) {
                console.error('Error creando partido:', err);
                return res.status(500).json({ error: err.message }); // Devuelve un error si no se puede crear el partido
            }
            res.status(201).json({
                id: results.insertId, // Devuelve el ID del nuevo partido insertado
                equipo_local,
                equipo_visitante,
                torneo_id,
                fecha
            });
        }
    );
});

module.exports = router;

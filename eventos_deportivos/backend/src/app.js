// backend/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usuariosRoutes = require('./routes/usuarios.routes'); // Importa las rutas
const torneosRoutes = require('./routes/torneos.routes');
const equiposRoutes = require('./routes/equipos.routes');
const inscripcionesRoutes = require('./routes/inscripciones.routes');
const partidosRoutes = require('./routes/partidos.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Cambia esto según tu puerto de frontend
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

// Middlewares
app.use(bodyParser.json()); // Para manejar JSON en las peticiones

// Rutas
app.use('/api/usuarios', usuariosRoutes); // Usamos las rutas de usuarios
app.use('/api/torneos', torneosRoutes);
app.use('/api/equipos', equiposRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/partidos', partidosRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;

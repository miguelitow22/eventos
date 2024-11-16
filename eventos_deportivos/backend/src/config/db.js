// backend/config/db.js
const mysql = require('mysql2');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Miguel10072007*', // Usa variables de entorno
    database: process.env.DB_NAME || 'eventos_deportivos',
    port: 3306,
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;

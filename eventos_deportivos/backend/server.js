const app = require('./src/app');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
const db = require('./src/config/db');

// Configuración del puerto
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

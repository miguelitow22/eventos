// src/middleware/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err.message); // Log del error
    res.status(err.status || 500).json({ error: err.message || 'Error desconocido' });
};

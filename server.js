const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // frontend
app.use(helmet());
app.use(express.json()); 

// MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Importar rutas 
const cardRouter = require('./src/routes/card.router.js');

// Rutas
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la API de Dragon Ball Z Cards!');
});

app.use('/api/cards', cardRouter);

// Iniciar server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

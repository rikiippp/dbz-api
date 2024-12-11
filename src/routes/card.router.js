const express = require('express');
const router = express.Router();
const Card = require('../models/card.model.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configurar multer para manejar archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para obtener todas las cartas
router.get('/', async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para crear una carta con imagen
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Crear un stream desde el Buffer del archivo
        const streamUpload = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'dbz_cards' }, // Carpeta en Cloudinary
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };

        // Subir la imagen a Cloudinary usando el stream
        const result = await streamUpload(req.file.buffer);

        // Crear la carta con la URL de la imagen
        const card = new Card({
            name: req.body.name,
            saga: req.body.saga,
            number: req.body.number,
            rarity: req.body.rarity,
            text: req.body.text,
            imageUrl: result.secure_url,
        });

        const newCard = await card.save();
        res.status(201).json(newCard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta para obtener una carta por ID
router.get('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Carta no encontrada' });
        }
        res.json(card);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para actualizar una carta por ID
router.patch('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Carta no encontrada' });
        }

        if (req.body.name) card.name = req.body.name;
        if (req.body.saga) card.saga = req.body.saga;
        if (req.body.number) card.number = req.body.number;
        if (req.body.rarity) card.rarity = req.body.rarity;
        if (req.body.text) card.text = req.body.text;
        if (req.body.imageUrl) card.imageUrl = req.body.imageUrl;

        const updatedCard = await card.save();
        res.json(updatedCard);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta para eliminar una carta por ID
router.delete('/:id', async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Carta no encontrada' });
        }

        await Card.deleteOne({ _id: req.params.id }); 
        res.json({ message: 'Carta eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

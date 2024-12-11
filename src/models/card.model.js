const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
    },
    saga: {
        type: String,
        required: [true, 'La saga es obligatoria'],
    },
    number: {
        type: Number,
        required: [true, 'El número es obligatorio'],
    },
    rarity: {
        type: String,
        required: [true, 'La rareza es obligatoria'],
    },
    text: {
        type: String,
        required: [true, 'El texto es obligatorio'],
    },
    imageUrl: {
        type: String,
        required: [true, 'La URL de la imagen es obligatoria'],
        match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/, 'La URL de la imagen no es válida'],
    },
});

module.exports = mongoose.model('Card', CardSchema);


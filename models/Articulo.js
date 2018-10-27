const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let articulos = new Schema({
    autor: {
        type: String,
        required: [true, "autor es requerido"],
        trim: true
    },
    cordinador: {
        type: String,
        required: [true, "cordinador es requerido"],
        trim: true
    },
    contenido_es: {
        type: String,
        required: [true, "contenido_es es requerido"],
    },
    contenido_en: {
        type: String,
        required: [true, "contenido_en es requerido"],
    },
    contenido_cr: {
        type: String,
        required: [true, "contenido_cr es requerido"],
    },
    etiquetas: [{
        type: String,
        uppercase: true,
        trim: true
    }],
    multimedia: [{
        type: String
    }],
    audio: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("articulos", articulos);
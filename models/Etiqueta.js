const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
const {
    GRAMATICA
} = require('../config/constants');


let textos = new Schema({
    contenido_es: {
        type: String,
        required: [true, "contenido_es es requerido"],
        unique: true,
        uppercase: true,
        trim: true
    },
    contenido_en: {
        type: String,
        required: [true, "contenido_en es requerido"],
        uppercase: true,
        trim: true
    },
    contenido_cr: {
        type: String,
        required: [true, "contenido_cr es requerido"],
        uppercase: true,
        trim: true
    },
    tipo: {
        type: String,
        default: "etiqueta"
    },
    gramatica: [{
        type: String,
        // required: [true, "gramática es requerida"],
        trim: true,
        enum: GRAMATICA 
    }],
    galeria: [{
        path: {
            type: String
        },
        author: {
            type: String
        }
    }]
});

textos.plugin(uniqueValidator);
module.exports = mongoose.model("textos", textos);
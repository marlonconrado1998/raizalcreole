const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let autores = new Schema({
    id: {
        type: String,
        required: [true, "id es requerido"],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, "nombre es requerido"],
    },
    email: {
        type: String,
        required: [true, "email es requerido"],
        unique: true
    },
    ubicacion: {
        type: String,
        required: [true, "ubicacion es requerido"],
    }
});

autores.plugin(uniqueValidator);
module.exports = mongoose.model("autores", autores);
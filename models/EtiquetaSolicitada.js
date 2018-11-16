const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let etiquetas_solicitadas = new Schema({
    nombre: {
        type: String,
        required: [true, "nombre es requerido"],
        uppercase: true,
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model("etiquetas_solicitadas", etiquetas_solicitadas);
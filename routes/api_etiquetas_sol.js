const express = require("express");
const EtiquetaSolicitada = require("../models/EtiquetaSolicitada");
const mongoose = require('mongoose');
const app = express();
var Response = require("../models/Response");


app.get('/etiquetas_solicitadas', (req, res) => {
    let response = new Response(res);
    EtiquetaSolicitada.find((error, etiquetaSolDB) => {
        if (error) return response.BAD_REQUEST('Error al consultar la base de datos');
        response.OK(etiquetaSolDB);
    });
});

app.post('/etiquetas_solicitadas', (req, res) => {

    let response = new Response(res);
    let etiqueta_solicitada = new EtiquetaSolicitada({
        nombre: req.body.nombre
    });
    etiqueta_solicitada.save((error, etiquetaSolDB) => {
        if (error) return response.BAD_REQUEST('Error al consultar la base de datos.');
        response.OK(etiquetaSolDB);
    });
});

app.delete('/etiqueta_solicitada/:idsolicitud_sol', (req, res) => {
    let response = new Response(res);
    EtiquetaSolicitada.deleteOne({
        _id: req.params.idsolicitud_sol
    },(error, etiquetaSolDB) => {
        if (error) return response.BAD_REQUEST('Error al eliminar el registro.');
        response.OK(true);
    });
});

module.exports = app;
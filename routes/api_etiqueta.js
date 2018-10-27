const express = require("express");
const Etiqueta = require("../models/etiqueta");
const mongoose = require('mongoose');
var upperCase = require('upper-case');
let fs = require('fs');
const app = express();
const multer = require('multer');

var Class_Upload = require('../models/Upload');
var Upload = new Class_Upload(multer);
var Response = require("../models/Response");
const {
    GRAMATICA
} = require('../config/constants');
var  { verifyToken } = require('../middlewares/authorization')


var upload = multer({
    storage: Upload.uploadImageToServer('uploads')
}).single('image');


app.post('/image', function (req, res) {

    var response = new Response(res);
    try {
        upload(req, res, function (err) {
            if (err) {
                return response.BAD_REQUEST('Error al subir los archivos.');
            }
            return response.OK(req.file);
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.get('/image/:path', function (req, res) {

    var response = new Response(res);
    try {
        return res.download('uploads/' + req.params.path);
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.delete('/image/:path/:id', (req, res) => {

    var response = new Response(res);
    try {
        var path = req.params.path;
        fs.unlink('uploads/' + path, (err) => {
            if (err) {
                return response.BAD_REQUEST('Error al eliminar el archivo.');
            };
            Etiqueta.findOneAndUpdate({
                _id: req.params.id
            }, {
                $pull: {
                    galeria: {
                        path: path
                    }
                }
            }, {
                new: false
            }, function (error, etiquetaDB) {
                if (error) {
                    return response.BAD_REQUEST('Error al eliminar el archivo.');
                }
                return response.OK(path);
            });
        });
    } catch (error) {
        console.log(error);
        return response.INTERNAL_SERVER();
    }
})

app.post('/etiqueta', verifyToken, function (req, res) {

    var response = new Response(res);
    try {
        let etiqueta = req.body;
        let textos = new Etiqueta({
            contenido_es: etiqueta.contenido_es,
            contenido_en: etiqueta.contenido_en,
            contenido_cr: etiqueta.contenido_cr,
            tipo: etiqueta.tipo,
            gramatica: etiqueta.gramatica,
            galeria: etiqueta.galeria
        });
        textos.save((error, etiquetaDB) => {
            if (error) {
                var msg = "No se pudo agregar esta etiqueta."
                if (error.errors.contenido_es) {
                    msg = "La etiqueta \"" + error.errors.contenido_es.value + "\" ya existe.";
                }
                return response.BAD_REQUEST(msg);
            }
            return response.OK(etiquetaDB);
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});


app.post('/get_etiquetas', verifyToken, (req, res) => {

    let body = req.body.data;
    let response = new Response(res);
    let query = {};

    if (body.search && body.search.trim() !== "") {
        query.contenido_es = {
            $regex: body.search,
            $options: 'i'
        }
    }
    if (body.letter && body.letter.trim() !== "") {
        query.contenido_es = {
            $regex: '^' + body.letter,
            $options: 'i'
        }
    }
    if (body.lastId && body.lastId.trim() !== "") {
        query._id = {
            $lt: new mongoose.mongo.ObjectId(body.lastId)
        }
    }

    try {
        Etiqueta
            .find(query, (error, etiquetasDB) => {
                if (error) return response.BAD_REQUEST("Error al consultar la BD.");
                return response.OK(etiquetasDB);
            }).sort({
                _id: '-1'
            })
            .select('contenido_es')
            .limit(10)
    } catch (error) {
        response.INTERNAL_SERVER();
    }
});

app.get('/etiquetas', verifyToken, function (req, res) {

    var response = new Response(res);
    try {
        Etiqueta.find(function (error, etiquetas) {
            if (error) {
                return response.BAD_REQUEST("Error al consultar la BD.");
            }
            return response.OK(etiquetas);
        }).select("contenido_cr contenido_en contenido_es gramatica galeria");
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.get('/etiquetas/:etiquetas', verifyToken, function (req, res) {

    var response = new Response(res);
    try {
        var etiquetas = req.params.etiquetas.split(",");
        var query = [];

        for (var index in etiquetas) {
            if (etiquetas[index].trim()) {
                query.push(upperCase(etiquetas[index]).trim());
            }
        }
        Etiqueta.find({
            contenido_es: {
                $in: query
            }
        }, function (error, etiquetas) {
            if (error) {
                return response.BAD_REQUEST("Error al consultar la BD");
            }
            return response.OK(etiquetas);
        }).select("contenido_cr contenido_en contenido_es");
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.put('/etiqueta', verifyToken, function (req, res) {

    var response = new Response(res);
    try {
        let es = req.body.contenido_es;
        let etiqueta = {
            contenido_en: req.body.contenido_en,
            contenido_cr: req.body.contenido_cr,
            gramatica: req.body.gramatica
        };
        Etiqueta.findOneAndUpdate({
            contenido_es: es
        }, {
            $set: etiqueta,
            $push: {
                galeria: {
                    $each: req.body.new_galeria
                }
            }
        }, {
            new: false
        }, function (error, etiquetaDB) {
            if (error) {
                return response.BAD_REQUEST('Error al modificar esta etiqueta.');
            }
            return response.OK(etiquetaDB);
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.get('/gramatica', verifyToken, (req, res) => {

    var response = new Response(res);
    try {
        return response.OK(GRAMATICA);
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

module.exports = app;
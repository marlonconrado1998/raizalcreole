const express = require("express");
const app = express();
const mongoose = require('mongoose');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const multer = require('multer');
const Grid = require('gridfs-stream');
const path = require('path');
var gfs;
const conn = mongoose.createConnection(process.env.MONGO_URI);

var Response = require("../models/Response");
const Articulo = require("../models/Articulo");
var  { verifyToken } = require('../middlewares/authorization')


conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
})

var storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                console.log(filename);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});

var upload = multer({
    storage: storage
}).single('file');

app.post('/files', (req, res) => {

    let response = new Response(res);
    try {
        upload(req, res, function (err) {
            if (!err) {
                return response.OK(req.file);
            }
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.delete('/files/:id_file', (req, res) => {

    let response = new Response(res);
    try {
        let id = req.params.id_file;
        var objectId = new mongoose.mongo.ObjectId(id);

        gfs.files.deleteOne({
            _id: objectId
        }, function (err) {
            if (!err) {
                return response.OK(objectId);
            }
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});


app.put('/articulo', verifyToken, (req, res) => {

    let response = new Response(res);
    let id_articulo = req.body.id;
    let articulo = req.body;

    let new_articulo = {
        autor: articulo.autor,
        contenido_es: articulo.articulo.espanol,
        contenido_en: articulo.articulo.ingles,
        contenido_cr: articulo.articulo.kreole,
        etiquetas: articulo.etiquetas
    };
    Articulo.findOneAndUpdate({
        _id: id_articulo
    }, {
        $set: new_articulo
    }, {
        new: false
    }, (error, articuloDB) => {
        if (error) {
            return response.BAD_REQUEST("Error al modificar el articulo.");
        }
        return response.OK(articuloDB);
    });
})


app.get('/articulos', verifyToken, (req, res) => {
    let response = new Response(res);
    try {
        Articulo
            .find((error, articulosDB) => {
                if (error)
                    return response.BAD_REQUEST("Error al consultar la DB.");
                return response.OK(articulosDB);
            })
            .select('etiquetas contenido_es contenido_en contenido_cr ref autor fecha audio');
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.post('/articulo', verifyToken, (req, res) => {

    let response = new Response(res);
    try {
        let articulo = req.body;
        let articulos = new Articulo({
            autor: articulo.autor,
            cordinador: "marlonconrado1998@gmail.com",
            contenido_es: articulo.articulo.espanol,
            contenido_en: articulo.articulo.ingles,
            contenido_cr: articulo.articulo.kreole,
            etiquetas: articulo.etiquetas,
            audio: articulo.audio
        });

        articulos.save((error, articuloDB) => {
            if (error) {
                return response.BAD_REQUEST("Error al guardar en la DB.");
            }
            return response.OK(articuloDB);
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});



app.get('/articulos/:usuario', verifyToken, function (req, res) {

    let response = new Response(res);
    try {
        let usuario = req.params.usuario;
        Articulo.find({
                cordinador: usuario
            }, (error, articulosDB) => {
                if (error) {
                    return response.BAD_REQUEST("Error al consultar la DB.");
                }
                return response.OK(articulosDB);
            })
            .select('etiquetas contenido_es contenido_en contenido_cr ref autor fecha audio');
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.post('/get_articulos', verifyToken, function (req, res) {

    let response = new Response(res);
    let body = req.body.data;
    let query = {
        etiquetas: body.etiqueta
    };

    if (body.lastId && body.lastId !== "") {
        query._id = {
            $lt: new mongoose.mongo.ObjectId(body.lastId)
        }
    }
    try {
        Articulo
            .find(query, (error, articulosDB) => {
                if (error) return response.BAD_REQUEST("Error al consultar la DB.");
                return response.OK(articulosDB);
            })
            .select('contenido_es fecha')
            .sort({
                _id: '-1'
            })
            .limit(10);
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.get('/articulo/:id_articulo', verifyToken, (req, res) => {
    let response = new Response(res);
    try {
        let objectId = new mongoose.mongo.ObjectId(req.params.id_articulo);

        Articulo
            .find({
                _id: objectId
            }, (error, articulosDB) => {
                if (error) return response.BAD_REQUEST("Error al consultar la DB.");
                return response.OK(articulosDB);
            })
            .limit(1);
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.get('/files/:idfile', (req, res) => {

    let response = new Response(res);
    try {
        let objectId = new mongoose.mongo.ObjectId(req.params.idfile);
        const readStream = gfs.createReadStream({
            _id: objectId
        });
        readStream.pipe(res);
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.post('/articulos_by_date', verifyToken, (req, res) => {
    let response = new Response(res);
    try {
        Articulo
            .find({
                fecha: {
                    $lte: req.body.dateInit,
                    $gte: req.body.dateEnd
                }
            }, (error, articulosDB) => {
                if (error) {
                    return response.BAD_REQUEST("Error al consultar la DB.");
                }
                return response.OK(articulosDB);
            })
            .select('etiquetas contenido_es contenido_en contenido_cr ref autor fecha audio');
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
})
module.exports = app;
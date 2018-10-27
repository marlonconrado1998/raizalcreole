const express = require("express");
const app = express();

var Response = require("../models/Response");
const Autor = require("../models/Autor");
var  { verifyToken } = require('../middlewares/authorization')


app.get('/autor/:id', verifyToken, function (req, res) {
    
    var response = new Response(res);
    try {
        var id = new mongoose.mongo.ObjectId(req.params.id);
        Autor.findById(id, function (error, autorDB) {
            if (error) {
                return Response.BAD_REQUEST("Error al consultar la BD");
            }
            return response.OK(autorDB);
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.put('/autor', verifyToken, function (req, res) {
    
    var response = new Response(res);
    try {
        let id = req.body.id;
        let autor = {
            nombre: req.body.nombre,
            email: req.body.email,
            ubicacion: req.body.ubicacion
        };

        // Actualiza el registro
        Autor.findOneAndUpdate({
            id: id
        }, {
            $set: autor
        }, {
            new: false
        }, function (err, autorDB) {
            if (err) {
                if (err.codeName == 'DuplicateKey') {
                    return response.BAD_REQUEST("El email ya se encuentra registrado..");
                }
                return response.BAD_REQUEST("Error al modificar en la BD.");
            }
            return response.OK(autorDB);
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.post('/autor', verifyToken, function (req, res) {
    
    var response = new Response(res);
    try {
        let autor = req.body;
        let autores = new Autor({
            id: autor.id,
            nombre: autor.nombre,
            email: autor.email,
            ubicacion: autor.ubicacion
        });
        autores.save((error, autorDB) => {
            if (error) {

                var message = 'No se pudo agregar este registro. ';

                if (error.errors.id) {
                    message += 'La identificación ya se encuentra registrada. ';
                }
                if (error.errors.email) {
                    message += 'El email ya se encuentra registrado.';
                }
                return response.BAD_REQUEST(message);
            }
            return response.OK(autorDB);
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

app.get('/autores', verifyToken, function (req, res) {
    
    var response = new Response(res);
    try {
        Autor.find(function (error, autoresDB) {
            if (error) {
                return response.BAD_REQUEST("Error al consultar la BD");
            }
            return response.OK(autoresDB);
        });
    } catch (error) {
        return response.INTERNAL_SERVER();
    }
});

module.exports = app;
const express = require("express");
const app = express();
var jwt = require('jsonwebtoken');
var Response = require('../models/Response');

app.post('/autentication', (req, res) => {
    let response = new Response(res);
    try {
        let body = req.body;
        let token = jwt.sign(body, process.env.JWT_SECRET);
        let data = JSON.stringify({
            _email : body.email,
            nombre: body.nombre,
            rol: body.rol,
            urlAsig: body.urlAsig
        });
        res.send('http://69.175.103.163/~mconradog21/raizalcreole/#!/login?data=' + data +"&token="+ token);
    } catch (error) {
        response.INTERNAL_SERVER('Error interno del servidor.')
    }
});

app.get('/autentication/:token', (req, res) => {
    res.status(200).send(req.params.token);
});

module.exports = app;
const express = require("express");
const app = express();

// Routes 
app.use(require('./api_articulo'));
app.use(require('./api_auth'));
app.use(require('./api_autor'));
app.use(require('./api_etiqueta'));
app.use(require('./api_etiquetas_sol'));

module.exports = app;
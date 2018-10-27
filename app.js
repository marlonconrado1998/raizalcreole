const express = require("express");
const bodyParser = require('body-parser');
const app = express();
require('./config/config');
require('./models/MongoDB');
const port = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", "http://localhost");
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(require('./routes/index'));
// Listen
app.listen(port);
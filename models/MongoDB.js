const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
mongoose.connection.on('connected', (conn) => console.log('Conexión exitosa'));
mongoose.connection.on('error', err => console.log('Error => ' + err));
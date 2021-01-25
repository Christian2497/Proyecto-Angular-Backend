'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 4000;


mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/proyecto_angular', { useNewUrlParser: true}).then(() => {
    console.log('La conexion a la base de datos se ha realizado bien!!');

    app.listen(port, () => {
        console.log('Servidor corriendo en http://localhost:'+port);
    })
})
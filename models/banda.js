'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BandaSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String
})


module.exports = mongoose.model('Banda', BandaSchema);
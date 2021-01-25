'use strict'

var express = require('express');
var BandaController = require('../controllers/banda');

var router = express.Router();

router.get('/bandas', BandaController.getBandas);
router.get('/bandas/:id', BandaController.getBanda);
router.delete('/bandas/:id', BandaController.delete);
router.post('/save', BandaController.save);


module.exports = router;
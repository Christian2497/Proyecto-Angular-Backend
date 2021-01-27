'use strict'

var express = require('express');
var BandaController = require('../controllers/banda');

var router = express.Router();

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './upload/bandas'});

router.get('/bandas', BandaController.getBandas);
router.get('/bandas/:id', BandaController.getBanda);
router.delete('/bandas/:id', BandaController.delete);
router.post('/save', BandaController.save);
router.get('/search/:search', BandaController.search);
router.get('/get-image/:image', BandaController.getImage);
router.post('/upload-image/:id?', md_upload, BandaController.upload);

module.exports = router;
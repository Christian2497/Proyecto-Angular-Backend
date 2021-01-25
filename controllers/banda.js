'use strict'

var validator = require('validator');
const banda = require('../models/banda');
var Banda = require('../models/banda');


var controller = {

    getBandas: (req, res) => {
        Banda.find({}).exec((err, bandas) => {

            if(err){
                return res.status(404).send({
                    status: 'error',
                    message: 'Error al devolver las bandas'
                });
            }

            if(!bandas){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay bandas para mostrar'
                });
            }

            return res.status(200).send({
                status: 'success',
                bandas,
            });
        })
    },

    getBanda: (req, res) => {
        var bandaId = req.params.id;

        if(!bandaId || bandaId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe la banda',
            });
        }

        Banda.findById(bandaId, (err, banda) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al devolver los datos',
                }); 
            }

            if(!banda){
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la banda',
                });
            }

            return res.status(200).send({
                status: 'success',
                banda
            });
        });
    },

    save: (req, res) => {
        var params = req.body;

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_description = !validator.isEmpty(params.description);
            var validate_year = !validator.isEmpty(params.year);
            var validate_image = !validator.isEmpty(params.image);
        } catch (error) {
            return res.status(200).send({
                status: error,
                message: 'Faltan datos por enviar'
            })
        }

        if(validate_title && validate_description && validate_year && validate_image){
            var banda = new Banda();

            banda.title = params.title;
            banda.description = params.description;
            banda.year = params.year;
            banda.image = null;


            banda.save((err, bandaStored) => {

                if(err || !bandaStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'La banda no se ha guardado!'
                    })
                }
                return res.status(200).send({
                    status: 'success',
                    banda: bandaStored,
                });

            })

        }else{
            return res.status(404).send({
                status: error,
                message: "Los datos no son válidos"
            })
        }
    },
    
    delete: (req, res) => {
        var bandaId = req.params.id;

        Banda.findOneAndDelete({_id: bandaId}, (err, bandaRemoved) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al borrar!'
                });
            }

            if(!bandaRemoved){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado porque no existe'
                });
            }

            return res.status(200).send({
                status: 'success',
                banda: bandaRemoved,
            });
        })
    },
}


module.exports = controller;
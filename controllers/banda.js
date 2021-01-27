'use strict'

var validator = require('validator');
var fs = require('fs');
var path = require('path');
const banda = require('../models/banda');
var Banda = require('../models/banda');
const { exists } = require('../models/banda');


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
            return res.status(404).send({
                status: error,
                message: 'Faltan datos por enviar'
            })
        }

        if(validate_title && validate_description && validate_year && validate_image){
            var banda = new Banda();

            banda.title = params.title;
            banda.description = params.description;
            banda.year = params.year;
            banda.image = params.image;


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

    search: (req, res) => {
        var searchString = req.params.search;

        Banda.find({ "$or": [
            { "title" : { "$regex": searchString, "$options": "i"}},
            { "content" : { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['date', 'descending']])
        .exec((err, bandas) => {

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición!'
                })
            }

            if(!bandas || bandas.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay bandas que coincidan con tu busqueda!'
                })
            }

            return res.status(200).send({
                status: 'success',
                bandas
            })
        })
    },

    upload: (req, res) => {


        var file_name = 'Imagen no subida...'

        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');


        var file_name = file_split[2];

        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida'
                })
            })
        }else{
            var bandaId = req.params.id;

            if(bandaId){
                Banda.findOneAndUpdate({_id: bandaId}, {image: file_name}, {new: true}, (err, bandaUpdated) => {
                    if(err || !bandaUpdated){
                        return res.status(404).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de la banda!'
                        })
                    }
                    
                    return res.status(200).send({
                        status: 'success',
                        banda: bandaUpdated
                    })
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                })
            }
        }
    },

    getImage: (req, res) => {
        var file = req.params.image;
        var path_file = './upload/bandas/'+file;

        fs.exists(path_file, (exists) => {
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                })
            }
        })
    }
}


module.exports = controller;
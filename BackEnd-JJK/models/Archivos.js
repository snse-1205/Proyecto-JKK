const mongoose = require('mongoose');



const ArchivoSchema = new mongoose.Schema({
    ruta: {type: String, require: true},
    nombre: {type: String,require: true}
});


const Archivo = mongoose.model('Archivo',ArchivoSchema);

module.exports = Archivo;
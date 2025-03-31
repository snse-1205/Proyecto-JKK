const mongoose = require('mongoose');

const fichaPersonajeSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    genero:{ type: String, required: true },
    edad: {type: Number, required:true},
    estado: { type: String, required: true },
    tecnicaMaldita: { type: mongoose.Schema.Types.ObjectId, ref: 'TecnicaMaldita' },
    foto: { type: mongoose.Schema.Types.ObjectId, ref: 'Archivo' },
    expansionDominio: { type: Boolean, default: false }
});

const FichasPersonajes = mongoose.model('FichasPersonajes', fichaPersonajeSchema);

module.exports = FichasPersonajes;

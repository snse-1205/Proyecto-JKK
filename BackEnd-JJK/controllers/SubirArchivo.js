const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Archivo = require('../models/Archivos');

let nombreArchivo = "";
let booleano = false;

async function crearArchivoMongo(file) {
    try {
        const Pruta = "../Archivos/";

        // Crear una instancia del modelo
        const ArchivoModelo = new Archivo({
            ruta: Pruta,
            nombre: file
        });

        if (!file) {
            console.log("No hay un archivo seleccionado");
            return null;
        }

        // Guardar el archivo en la base de datos
        const archivoGuardado = await ArchivoModelo.save();
        console.log("Archivo guardado:", archivoGuardado);

        return archivoGuardado;  // Devolver el archivo guardado con su _id
    } catch (err) {
        console.log("Error al guardar el archivo en la base de datos:", err);
        return null;
    }
}

function uploadFile() {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "Archivos"); 
        },
        filename: (req, file, cb) => {
            nombreArchivo = Date.now() + '-' + file.originalname;
            cb(null, nombreArchivo);
        }
    });

    const upload = multer({ storage: storage }).single('Avatar');

    return (req, res, next) => {
        upload(req, res, async (err) => {
            if (err) {
                console.log("Error subiendo el archivo:", err);
                return res.status(400).json({ error: 'Error subiendo el archivo' });
            }

            const archivoGuardado = await crearArchivoMongo(req.file.filename);

            if (archivoGuardado) {
                return res.status(200).json({ success: true, _id: archivoGuardado._id });
            } else {
                return res.status(400).json({ error: 'Error al guardar el archivo' });
            }
        });
    };
}

module.exports = {
    uploadFile,
    booleano
};

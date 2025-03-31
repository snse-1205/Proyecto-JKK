
const path = require('path');
const fs = require('fs');
const Archivo = require('../models/Archivos');
const multer = require('multer');
isDeleted = false;
let clave = "";
function cambiarBool(valor) {
    this.isDeleted = valor;
}

function eliminarArchivo(rutaArchivo) {
    console.log("Si entra a la funcion para eliminar archivo")
    fs.unlink(rutaArchivo, (err) => {
        if (err) {
            console.error('Error al eliminar el archivo:', err);
            cambiarBool(false);
            return;
        } else {
            console.log('Archivo eliminado correctamente:', rutaArchivo);
            cambiarBool(true);
            console.log("Valor de isDeleted: " + isDeleted)
            return;
        }
    });
};

exports.deleteArchivo = async (req, res) => {
    try {

        const { id } = req.params;
        console.log('Id del archivo: ' + id);
        const encontrar = await Archivo.findById(id);
        if (encontrar) {
            const nombre = encontrar.nombre;
            console.log('Nombre del archivo: ' + nombre);
            const ruta = path.join('Archivos', nombre);

            eliminarArchivo(ruta)
            console.log("Valor de isDeleted despues de ejecutar la funcion: " + isDeleted)

            const deletedArchivo = await Archivo.findByIdAndDelete(id);
            if (deletedArchivo) {
                res.status(200).send("Archivo eliminado exitosamente");
                return;
            } else {
                res.status(400).send("No se encontro ningun archivo con el nombre solicitado")
                return;
            }

        } else {
            res.status(400).send("No se encontro ningun archivo con el id solicitado");
            return;
        }


    } catch (err) {
        console.log("Error en deleteArchivo " + err)
        res.status(500).send("Error en el servidor")
    }
}



exports.leerTodosArchivos = async (req, res) => {
    try {

        const Fotos = await Archivo.find();
        res.status(200).send(Fotos);

    } catch (err) {
        console.log("Error en leerTodosArchivos " + err);
        res.status(500).send("Error en el servidor")
    }
}

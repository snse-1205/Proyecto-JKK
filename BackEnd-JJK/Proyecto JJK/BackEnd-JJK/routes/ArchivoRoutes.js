const { uploadFile } = require('../controllers/SubirArchivo');
const auth = require('../auth/auth');
const controladorArchivo = require('../controllers/ControladorArchivo');

module.exports = (app) => {
    app.post('/upload', uploadFile(), (req, res) => {
    });
    app.delete('/deleteFile/:id', auth.authenticate, auth.verificarRol, controladorArchivo.deleteArchivo);
    app.get('/leerArchivos', auth.authenticate, controladorArchivo.leerTodosArchivos);
};

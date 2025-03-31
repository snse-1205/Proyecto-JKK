const FichasPersonajesController = require('../controllers/FichasPersonajesController');
const Ficha = require('../models/FichasPersonajes');
const auth = require('../auth/auth');

module.exports = (app) => {
    app.post('/FichasPersonajes', auth.authenticate,auth.verificarRol,FichasPersonajesController.createFichaPersonajes);
    app.get('/FichasPersonajes', FichasPersonajesController.getAllFichasPersonajes);
    app.get('/FichasPersonajes/:id', FichasPersonajesController.getFichaPersonajesPorId);
    app.put('/FichasPersonajes/:id', auth.authenticate,auth.verificarRol,FichasPersonajesController.updateFichaPersonajes);
    app.delete('/FichasPersonajes/:id', auth.authenticate,auth.verificarRol,FichasPersonajesController.deleteFichaPersonajes);

    app.get('/buscarPorNombreFicha', FichasPersonajesController.buscarFichasPorNombre);
    app.get('/buscarPorTecnicasFicha', FichasPersonajesController.buscarFichasPorTecnicaMaldita);
    app.get('/buscarPorGeneroFicha', FichasPersonajesController.buscarFichasPorGenero);
    app.get('/buscarFichasPorTecnicaMalditaNombre', FichasPersonajesController.buscarFichasPorTecnicaMalditaNombre);
}

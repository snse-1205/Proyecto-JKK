const TecnicaMalditaController = require('../controllers/TecnicasMalditasController');

module.exports = (app) => {
    app.post('/TecnicasMalditas', TecnicaMalditaController.createTecnicaMaldita);
    app.get('/TecnicasMalditas', TecnicaMalditaController.getAllTecnicasMalditas);
    app.get('/TecnicasMalditas/:id', TecnicaMalditaController.getTecnicaMalditaById);
    app.put('/TecnicasMalditas/:id', TecnicaMalditaController.updateTecnicaMaldita);
    app.delete('/TecnicasMalditas/:id', TecnicaMalditaController.deleteTecnicaMaldita);
    app.get('/buscarTecnicaPorNombre',TecnicaMalditaController.buscarTecnicaMalditaPorNombre);
}
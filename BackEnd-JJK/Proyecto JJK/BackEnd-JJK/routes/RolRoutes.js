const RolController = require('../controllers/RolController');

module.exports = (app)=>{
    app.post('/RolUser',RolController.createRolUsuario);
    app.get('/RolUserLeer',RolController.getAllRol);
    app.get('/NombreporId',RolController.getRolByName);
}
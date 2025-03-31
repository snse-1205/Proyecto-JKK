const mongoose = require('mongoose');

const rolSchema = new mongoose.Schema({
    rol: {type: String, require: true}
});

const Rol = mongoose.model('Rol',rolSchema);

const seedRoles = async () => {
    try {
        const roles = ['admin', 'user'];

        for (const role of roles) {
            const existingRole = await Rol.findOne({ rol: role });
            if (!existingRole) {
                await Rol.create({ rol: role });
                console.log(`Rol '${role}' creado.`);
            } else {
                console.log(`Rol '${role}' ya existe.`);
            }
        }
    } catch (error) {
        console.error('Error inicializando los roles:', error);
    }
};

module.exports = {Rol,seedRoles};
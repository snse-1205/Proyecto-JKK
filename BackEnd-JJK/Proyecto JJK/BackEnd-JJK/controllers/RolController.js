const {Rol} = require('../models/rol');

exports.createRolUsuario = async(req,res) =>{
    try{

        let pRol = req.body.rol;
        
        const rol = new Rol({
            rol: pRol
        });

        if(!pRol){
            res.status(400).send("El Rol es requerido");
            return;
        }

        const RolGuardado = await rol.save();
        res.status(200).send(RolGuardado);
    }catch(err){
        console.log("Error en createUsuarioRol "+err);
        res.status(500).send("Error en el servidor");
    }
};

exports.getAllRol = async (req,res) =>{
    try{
        const Roles = await Rol.find();
        res.status(200).send(Roles);

    }catch(err){
        console.log("Error en getAllRol "+err);
        res.status(500).send("Error en el servidor");
    }
}

exports.getRolByName = async (req, res) => {
    try {
        const nombreRol = req.body.nombreRol;
        const rol = await Rol.findOne({ rol: 'user' }); 

        if (!rol) {
            return res.status(404).send("Rol no encontrado"); 
        }

        res.status(200).send({ id: rol._id, nombre: rol.rol });

    } catch (err) {
        console.log("Error en getRolByName " + err);
        res.status(500).send("Error en el servidor");
    }
}

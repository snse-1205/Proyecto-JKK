const User = require('../models/user');
const {Rol} = require('../models/rol');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "NahI'dWin";

exports.SignUp = async(req,res)=>{
    try{
        const pEmail = req.body.email;
        const pPassword = req.body.password;
        const pRol = req.body.rolUser;

        if(!pEmail){
            res.status(400).send("El email es requerido");
            return;
        }
        if(!pPassword){
            res.status(400).send("La clave es requerida");
            return;
        }
        if(!pRol){
            res.status(400).send("El rol es requerido")
            return;
        }

        // expresiones regulares
        let validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

        if(!validEmail.test){
            res.status(400).send("El email no es valido");
            return;
        }

        const userVerify = await User.findOne({email: pEmail});

        if(userVerify){
            res.status(400).send("Ya existe un usuario registrado");
            return;
        }

        const user = await new User({
            email: pEmail,
            password: pPassword,
            rolUser: pRol
        });

        const savedUser = await user.save();

        const payload = {id: savedUser.id, email: savedUser.email, rolUser: savedUser.rolUser};
        const token = jwt.sign(payload,SECRET_KEY);
        res.status(200).json({savedUser,token})

    }catch(err){
        console.log("Error en SingUp " + err);
        res.status(500).send("Error en el SignUp");
    }
};

exports.login = async(req,res)=>{
    try{
        const pEmail = req.body.email;
        const pPassword = req.body.password;

        const user = await User.findOne({email: pEmail});

        if(!user || user==null){
            res.status(400).send("Email o contraseña incorrectos");
            return;
        }

        const isMatch = await bcrypt.compare(pPassword,user.password);

        if(!isMatch){
            res.status(401).send("Email o contraseña incorrectos");
            return;
        }

        const payload = {id: user.id, email: user.email};
        const token = jwt.sign(payload,SECRET_KEY);
        res.status(200).json({user,token})

    }catch(err){
        console.log("Error en login "+err)
        res.status(500).send("Error en el servidor");
    }
}

exports.authenticate = (req,res,next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(401).send("falta la autenticación");
        return;
    }

    const[type, token] = authHeader.split(' ');

    if(type !== "Bearer"){
        res.status(401).send("Tipo de token invalido");
        return;
    }

    try{
        const decoded = jwt.verify(token,SECRET_KEY);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).send("token invalido");
        return;
    }
}

exports.verificarRol = async (req,res,next) =>{
    const id = req.headers.id;
    console.log(id)
    const usuario = await User.findById(id);

    const rolId = usuario.rolUser;

    const rol = await Rol.findById(rolId);
    console.log(rol.rol);
    if(rol.rol === "admin"){
        next();
    }else{
        res.status(401).send("No cuenta con los permisos para edicion")
    }
}
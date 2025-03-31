const FichasPersonajes = require('../models/FichasPersonajes');
const {TecnicaMaldita} = require('../models/TecnicasMalditas');
const Foto = require('../models/Archivos');
const mongoose = require('mongoose');

exports.createFichaPersonajes = async (req, res) => {
    try {
        const {
            nombre,
            descripcion,
            genero,
            edad,
            estado,
            tecnicaMaldita,
            foto,
            expansionDominio,
        } = req.body;

        if (!nombre) return res.status(400).send("El nombre es requerido");
        if (!descripcion) return res.status(400).send("La descripcion es requerida");
        if (!genero) return res.status(400).send("El genero es requerido");
        if (!edad) return res.status(400).send("La edad es requerida");
        if (estado === undefined) return res.status(400).send("El estado es requerido");
        if (expansionDominio === undefined) return res.status(400).send("La expansión de dominio es requerida");

        if (tecnicaMaldita && !mongoose.Types.ObjectId.isValid(tecnicaMaldita)) {
            return res.status(400).send("El ID de técnica maldita no es valido");
        }

        if (foto && !mongoose.Types.ObjectId.isValid(foto)) {
            return res.status(400).send("El ID de la foto no es valido");
        }

        const fichaPersonaje = new FichasPersonajes({
            nombre,
            descripcion,
            genero,
            edad,
            estado,
            tecnicaMaldita: tecnicaMaldita || null,
            foto: foto || null,
            expansionDominio,
        });

        const fichaGuardada = await fichaPersonaje.save();

        res.status(201).send(fichaGuardada);
    } catch (err) {
        console.error("Error en createFichaPersonajes:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.getAllFichasPersonajes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const fichas = await FichasPersonajes.find()
            .populate('tecnicaMaldita foto')
            .skip(skip)
            .limit(limit);

        const total = await FichasPersonajes.countDocuments();
        const totalPages = Math.ceil(total / limit);

        res.status(200).send({ page, totalPages, total, data: fichas });
    } catch (err) {
        console.error("Error en getAllFichasPersonajes:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.getFichaPersonajesPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const ficha = await FichasPersonajes.findById(id).populate('tecnicaMaldita foto');
        if (!ficha) return res.status(404).send("Ficha de personaje no encontrada");

        res.status(200).send(ficha);
    } catch (err) {
        console.error("Error en getFichaPersonajesById:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.updateFichaPersonajes = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, genero, edad, estado, tecnicaMaldita, foto, expansionDominio } = req.body;

        // Verificar que todos los campos obligatorios estén presentes
        if (!nombre || !descripcion || !genero || edad === undefined || !estado || expansionDominio === undefined) {
            return res.status(400).send("Todos los campos requeridos deben ser proporcionados");
        }

        // Validar el ObjectId de tecnicaMaldita si se proporciona
        let tecnicaMalditaId = null;
        if (tecnicaMaldita) {
            // Verificar si el ID de tecnicaMaldita es válido
            if (!mongoose.Types.ObjectId.isValid(tecnicaMaldita)) {
                return res.status(400).send("El ID de la técnica maldita no es válido");
            }
            tecnicaMalditaId = tecnicaMaldita; // Usar el valor de tecnicaMaldita si es válido
        }

        // Actualizar la ficha de personaje
        const fichaActualizada = await FichasPersonajes.findByIdAndUpdate(
            id,
            {
                nombre,
                descripcion,
                genero,
                edad,
                estado,
                tecnicaMaldita: tecnicaMalditaId, // Asignar null o el ID válido
                foto: foto || null, 
                expansionDominio
            },
            { new: true } 
        ).populate('tecnicaMaldita foto'); 

        if (!fichaActualizada) return res.status(404).send("Ficha de personaje no encontrada");

        res.status(200).send(fichaActualizada);
    } catch (err) {
        console.error("Error en updateFichaPersonajes:", err);
        res.status(500).send("Error en el servidor");
    }
};

exports.deleteFichaPersonajes = async (req, res) => {
    try {
        const { id } = req.params;

        const fichaEliminada = await FichasPersonajes.findByIdAndDelete(id);
        if (!fichaEliminada) return res.status(404).send("Ficha de personaje no enconteada");

        res.status(200).send(fichaEliminada);
    } catch (err) {
        console.error("Error en deleteFichaPersonajes:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.buscarFichasPorNombre = async (req, res) => {
    try {
        const { nombre } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        if (!nombre) return res.status(400).send("El nombre es requerido para realizar la busqueda");

        const fichas = await FichasPersonajes.find({
            nombre: { $regex: nombre, $options: 'i' }
        })
        .populate('tecnicaMaldita foto')
        .skip(skip)
        .limit(limit);

        const total = await FichasPersonajes.countDocuments({
            nombre: { $regex: nombre, $options: 'i' }
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).send({ page, totalPages, total, data: fichas });
    } catch (err) {
        console.error("Error en searchFichasByName:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.buscarFichasPorTecnicaMaldita = async (req, res) => {
    try {
        const { tecnicaMalditaId } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        if (!tecnicaMalditaId) return res.status(400).send("El Id de tecnica maldita es requerido");

        const fichas = await FichasPersonajes.find({
            tecnicaMaldita: tecnicaMalditaId
        })
        .populate('tecnicaMaldita foto')
        .skip(skip)
        .limit(limit);

        const total = await FichasPersonajes.countDocuments({
            tecnicaMaldita: tecnicaMalditaId
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).send({ page, totalPages, total, data: fichas });
    } catch (err) {
        console.error("Error en searchFichasByTecnicaMaldita:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.buscarFichasPorGenero = async (req, res) => {
    try {
        const { genero } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        if (!genero) return res.status(400).send("El genero es requerido para realizar la búsqueda");

        const fichas = await FichasPersonajes.find({
            genero: { $regex: genero, $options: 'i' }
        })
        .populate('tecnicaMaldita foto')
        .skip(skip)
        .limit(limit);

        const total = await FichasPersonajes.countDocuments({
            genero: { $regex: genero, $options: 'i' }
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).send({ page, totalPages, total, data: fichas });
    } catch (err) {
        console.error("Error en searchFichasByGenero:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.buscarFichasPorTecnicaMalditaNombre = async (req, res) => {
    try {
        const { nombre } = req.query;
        const page = parseInt(req.query.page) || 1; 
        const limit = 6; 
        const skip = (page - 1) * limit; 

        if (!nombre) {
            return res.status(400).send("El nombre de la técnica maldita es requerido");
        }

        const tecnicaMaldita = await TecnicaMaldita.findOne({
            tecnicaMaldita: { $regex: nombre, $options: 'i' }
        });

        if (!tecnicaMaldita) {
            return res.status(404).send("Técnica maldita no encontrada");
        }

        const tecnicaMalditaId = tecnicaMaldita._id;

        const fichas = await FichasPersonajes.find({
            tecnicaMaldita: tecnicaMalditaId
        })
            .populate('tecnicaMaldita foto')
            .skip(skip)
            .limit(limit);

        const total = await FichasPersonajes.countDocuments({
            tecnicaMaldita: tecnicaMalditaId
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).send({ page, totalPages, total, data: fichas });
    } catch (err) {
        console.error("Error en buscarFichasPorTecnicaMalditaNombre:", err);
        res.status(500).send("Error en el servidor");
    }
};


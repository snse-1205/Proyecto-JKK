const {TecnicaMaldita}  = require('../models/TecnicasMalditas');

exports.createTecnicaMaldita = async (req, res) => {
    try {
        const { tecnicaMaldita, descripcion } = req.body;

        if (!tecnicaMaldita) return res.status(400).send("El nombre de la tecnica maldita es requerido");
        if (!descripcion) return res.status(400).send("La descripción es requerida");

        const nuevaTecnica = new TecnicaMaldita({ tecnicaMaldita, descripcion });
        const tecnicaGuardada = await nuevaTecnica.save();

        res.status(201).send(tecnicaGuardada);
    } catch (err) {
        console.error("Error en createTecnicaMaldita:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.getAllTecnicasMalditas = async (req, res) => {
    try {
        const tecnicas = await TecnicaMaldita.find();

        res.status(200).send(tecnicas.map((tecnica) => ({
            id: tecnica._id,
            tecnicaMaldita: tecnica.tecnicaMaldita,
            descripcion: tecnica.descripcion,
        })));
    } catch (err) {
        console.error("Error en getAllTecnicasMalditas:", err);
        res.status(500).send("Error en el servidor");
    }
};


exports.getTecnicaMalditaById = async (req, res) => {
    try {
        const { id } = req.params;

        const tecnica = await TecnicaMaldita.findById(id);

        if (!tecnica) return res.status(404).send("Tecnica maldita no encontrada");

        res.status(200).send(tecnica);
    } catch (err) {
        console.error("Error en getTecnicaMalditaById:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.updateTecnicaMaldita = async (req, res) => {
    try {
        const { id } = req.params;
        const { tecnicaMaldita, descripcion } = req.body;

        if (!tecnicaMaldita) return res.status(400).send("El nombre de la tecnica maldita es requerido");
        if (!descripcion) return res.status(400).send("La descripcion es requerida");

        const tecnicaActualizada = await TecnicaMaldita.findByIdAndUpdate(
            id,
            { tecnicaMaldita, descripcion },
            { new: true }
        );

        if (!tecnicaActualizada)
            return res.status(404).send("Tecnica maldita no encontrada");

        res.status(200).send(tecnicaActualizada);
    } catch (err) {
        console.error("Error en updateTecnicaMaldita:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.deleteTecnicaMaldita = async (req, res) => {
    try {
        const { id } = req.params;

        const tecnicaEliminada = await TecnicaMaldita.findByIdAndDelete(id);

        if (!tecnicaEliminada)
            return res.status(404).send("Tecnica maldita no encontrada");

        res.status(200).send(tecnicaEliminada);
    } catch (err) {
        console.error("Error en deleteTecnicaMaldita:", err);
        res.status(500).send("Error en el servidor");
    }
}

exports.buscarTecnicaMalditaPorNombre = async (req, res) => {
    try {
        const { nombre } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        if (!nombre) return res.status(400).send("El nombre de la tecnica maldita es requerido");

        const tecnicasMalditas = await TecnicaMaldita.find({
            tecnicaMaldita: { $regex: nombre, $options: 'i' }
        })
        .skip(skip)
        .limit(limit);

        const total = await TecnicaMaldita.countDocuments({
            tecnicaMaldita: { $regex: nombre, $options: 'i' }
        });
        const totalPages = Math.ceil(total / limit);

        res.status(200).send({ page, totalPages, total, data: tecnicasMalditas });
    } catch (err) {
        console.error("Error en buscarTecnicaMalditaPorNombre:", err);
        res.status(500).send("Error en el servidor");
    }
}
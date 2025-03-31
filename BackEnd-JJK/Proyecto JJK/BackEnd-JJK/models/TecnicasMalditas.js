const mongoose = require('mongoose');

const tecnicaMalditaSchema = new mongoose.Schema({
    tecnicaMaldita: { type: String, required: true },
    descripcion: { type: String, required: true },
});

const TecnicaMaldita = mongoose.model('TecnicaMaldita', tecnicaMalditaSchema);

const seedTecnicas = async () => {
    try {
        const tecnicas = [
            'Tecnica Innata', 
            'Tecnica Hereditaria',
            'Tecnica de Barrera',
            'Tecnica de Nuevo Estilo de Sombra',
            'Tecnica de Maldicion Inversa',
            'Sin Tecnica',
            'Desconocido'
        ];

        for (const tecnica of tecnicas) {
            const existingRole = await TecnicaMaldita.findOne({ tecnicaMaldita: tecnica });
            if (!existingRole) {
                await TecnicaMaldita.create({ 
                    tecnicaMaldita: tecnica, 
                    descripcion: 'Luego lo describo' 
                });
                console.log(`Tecnica '${tecnica}' creada.`);
            } else {
                console.log(`Tecnica '${tecnica}' ya existe.`);
            }
        }
    } catch (error) {
        console.error('Error inicializando las técnicas:', error);
    }
};

module.exports = { TecnicaMaldita, seedTecnicas };

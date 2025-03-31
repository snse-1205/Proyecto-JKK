const express = require('express');
const mongoose = require('mongoose');

const AuthRoutes = require('./routes/AuthRoutes');
const RolRoutes = require('./routes/RolRoutes')
const ArchivoRoutes = require('./routes/ArchivoRoutes')
const FichasPersonajesRoutes = require('./routes/FichasPersonajesRoutes');
const TecnicasMalditasRoutes = require('./routes/TecnicasMalditasRoutes');

const {seedRoles} = require('./models/rol');
const {seedTecnicas} = require('./models/TecnicasMalditas');

// Realizar conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/JJK2024')
    .then(async () => {
        console.log("Conectado a Mongoose");
        await seedRoles();
        await seedTecnicas();
    })
    .catch((err) => {
        console.log('Error conectando a MongoDB ' + err);
    });

const app = express();
app.use(express.json());
AuthRoutes(app);
RolRoutes(app);
ArchivoRoutes(app);
FichasPersonajesRoutes(app);
TecnicasMalditasRoutes(app);

app.listen(3000,()=>{
    console.log("La aplicacion esta funcionando en el puerto 3000");
})
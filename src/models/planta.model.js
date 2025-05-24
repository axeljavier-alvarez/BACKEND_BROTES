const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantaSchema = new Schema({  // Aquí también puedes usar `new Schema(...)` por convención
    nombre: String,
    estado: String, 
    fecha_registro: Date,
    size: String,
    imagen: String,

    datosCategoria: [{
        idCategoria: { type: Schema.Types.ObjectId, ref: 'Categorias' },
        nombreCategoria: String,
        descripcionCategoria: String,
    }],

    datosCliente: [{
        idUsuario: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
        nombre: String,
        apellido: String,
        email: String,
        telefono: String,
        direccion: String,
        departamento: String, 
        municipio: String,
        rol: String
    }],

    datosHistorial: [{
        idHistorial: { type: Schema.Types.ObjectId, ref: 'Historial' },
        clienteId: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
        fecha: Date,
        tipo: String,
        mensaje: String,
        humedad_actual: Number, 
        metodo: String,
        precio: Number
    }],

    datosSucursal: [{
        idSucursal: { type: Schema.Types.ObjectId, ref: 'Sucursales' },
        nombreSucursal: String,
        direccionSucursal: String,
        telefonoSucursal: Number,
        departamento: String,
        municipio: String
    }],
});

module.exports = mongoose.model('Planta', PlantaSchema);

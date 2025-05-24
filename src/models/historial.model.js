const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HistorialSchema = new Schema({
    clienteId: { type: Schema.Types.ObjectId, ref: 'Usuarios' },
    fecha: Date,
    tipo: String,
    mensaje: String,
    humedad_actual: Number, 
    metodo: String,
    precio: Number
}, { collection: 'historial' });  // <-- colección llamada 'historial'

module.exports = mongoose.model('Historial', HistorialSchema);

const express = require('express');

const PlantaController = require('../controllers/planta.controller');
const autenticacionToken = require ('../middlewares/autenticacion');
const MulterImagen = require('../middlewares/multer')
const api = express.Router();

api.post('/agregarPlanta/:idSucursal',
    autenticacionToken.Auth,
    MulterImagen.single('imagen'), 
    PlantaController.agregarPlanta
);




/* ver plantas por sucursal */
api.get('/verPlantasPorSucursal/:idSucursal', autenticacionToken.Auth, PlantaController.verPlantasPorSucursal);


api.get('/verPlantasPorIdSucursal/:IdSucursal', autenticacionToken.Auth, PlantaController.obtenerPlantasPorIdSucursal);

api.get('/verPlantasPorCliente/:IdUsuario', autenticacionToken.Auth, PlantaController.verPlantasPorCliente);

api.get('/getCategoriasRolCliente', autenticacionToken.Auth, PlantaController.getCategoriasRolCliente);
api.get('/getCategoriasRolGestor', autenticacionToken.Auth, PlantaController.getCategoriasRolAdmin);


api.delete('/eliminarPlantarolCliente/:idPlanta', autenticacionToken.Auth , PlantaController.eliminarPlantarolCliente);
api.get('/getPlantaPorId/:idPlanta', autenticacionToken.Auth, PlantaController.verPlantasPorId);
api.put(
  '/editarPlantasRolCliente/:idPlanta',
  autenticacionToken.Auth,
  MulterImagen.single('imagen'), // para procesar la imagen si se envía
  PlantaController.editarPlantasRolCliente
);



api.put(
  '/nuevoEditarEstado/:idPlanta',
  autenticacionToken.Auth,
  PlantaController.nuevoEditarEstado
);

/* HISTORIAL */
api.post('/actualizarhistorial/:idPlanta',
    autenticacionToken.Auth,
    PlantaController.agregarHistorial
);


api.get('/historialPlanta/:idPlanta',
    autenticacionToken.Auth,
    PlantaController.obtenerHistorialPorPlanta
);


api.put('/editarHistorial/:idHistorial',
    autenticacionToken.Auth,
    PlantaController.editarHistorial
);

/* ver historial por id */
api.get('/verHistorialPorId/:idHistorial', autenticacionToken.Auth, PlantaController.verHistorialPorId);

api.delete('/eliminarHistorial/:idHistorial', autenticacionToken.Auth, PlantaController.eliminarHistorial);


module.exports= api;
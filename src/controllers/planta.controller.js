const Categorias = require('../models/categorias.model');
const Sucursales = require('../models/sucursales.model');
const Usuario = require('../models/usuarios.model');

const Planta = require('../models/planta.model');
const Historial = require('../models/historial.model');

const mongoose = require('mongoose');

function getCategoriasRolCliente(req, res){

  

  Categorias.find((err, categoriaEncontrada)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!categoriaEncontrada) return res.status(500).send({ mensaje: "Error al ver las categorias"});
    return res.status(200).send({ categorias: categoriaEncontrada});
  })
}

function getCategoriasRolAdmin(req, res){

  

  Categorias.find((err, categoriaEncontrada)=>{
    if(err) return res.status(500).send({ mensaje: "Error en la petición"});
    if(!categoriaEncontrada) return res.status(500).send({ mensaje: "Error al ver las categorias"});
    return res.status(200).send({ categorias: categoriaEncontrada});
  })
}

function agregarPlanta(req, res) {
    var parametros = req.body;
    const idSucursal = req.params.idSucursal;
    const imagenPath = req.file ? req.file.filename : null;

    // Validación básica
    if (!parametros.nombre || !parametros.size || !parametros.nombreCategoria) {
        return res.status(400).json({ mensaje: 'Debe proporcionar nombre, size y nombreCategoria.' });
    }

    // Buscar categoría
    Categorias.findOne({ nombreCategoria: parametros.nombreCategoria }, (err, categoriaEncontrada) => {
        if (err) return res.status(500).json({ mensaje: 'Error en la petición de categoría' });
        if (!categoriaEncontrada) return res.status(404).json({ mensaje: 'Categoría no encontrada con ese nombre' });

        // Buscar sucursal
        Sucursales.findById(idSucursal, (err, sucursalEncontrada) => {
            if (err) return res.status(500).json({ mensaje: 'Error en la petición de sucursal' });
            if (!sucursalEncontrada) return res.status(404).json({ mensaje: 'Sucursal no encontrada' });

            // Buscar usuario por ID para obtener todos los datos completos
            Usuario.findById(req.user.sub, (err, usuarioEncontrado) => {
                if (err) return res.status(500).json({ mensaje: 'Error al buscar usuario' });
                if (!usuarioEncontrado) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

                // Crear planta
                var planta = new Planta();
                planta.nombre = parametros.nombre;
                planta.estado = 'pendiente';
                planta.size = parametros.size;
                planta.fecha_registro = new Date();
                planta.imagen = imagenPath;

                planta.datosCategoria = [{
                    idCategoria: categoriaEncontrada._id,
                    nombreCategoria: categoriaEncontrada.nombreCategoria,
                    descripcionCategoria: categoriaEncontrada.descripcionCategoria
                }];

                planta.datosCliente = [{
                    idUsuario: usuarioEncontrado._id,
                    nombre: usuarioEncontrado.nombre,
                    apellido: usuarioEncontrado.apellido,
                    email: usuarioEncontrado.email,
                    telefono: usuarioEncontrado.telefono,
                    direccion: usuarioEncontrado.direccion,
                    departamento: usuarioEncontrado.departamento,
                    municipio: usuarioEncontrado.municipio,
                    rol: usuarioEncontrado.rol
                }];

                planta.datosSucursal = [{
                    idSucursal: sucursalEncontrada._id,
                    nombreSucursal: sucursalEncontrada.nombreSucursal,
                    direccionSucursal: sucursalEncontrada.direccionSucursal,
                    telefonoSucursal: sucursalEncontrada.telefonoSucursal,
                    departamento: sucursalEncontrada.departamento,
                    municipio: sucursalEncontrada.municipio
                }];

                planta.datosHistorial = [];

                // Guardar planta
                planta.save((err, plantaGuardada) => {
                    if (err) return res.status(500).json({ mensaje: 'Error al guardar la planta' });
                    if (!plantaGuardada) return res.status(500).json({ mensaje: 'No se pudo guardar la planta' });

                    return res.status(200).json({ planta: plantaGuardada });
                });
            });
        });
    });
}




function obtenerPlantasPorIdSucursal(req, res) {
    const idSucursal = req.params.IdSucursal;
    const idCliente = req.user.sub; // Este es el ID del cliente autenticado

    // Buscar solo plantas de esa sucursal Y que pertenezcan al usuario autenticado
    Planta.find({
        'datosCategoria.idCategoria': { $exists: true }, // Validación opcional
        'datosCliente.idUsuario': idCliente,
        'datosCategoria.idCategoria': { $exists: true },
        'datosCliente': { $elemMatch: { idUsuario: idCliente } }, // Este es el filtro importante
        'datosSucursal.idSucursal': idSucursal // Asegúrate que tengas este campo si asocias planta a sucursal
    }).exec((err, plantasEncontradas) => {
        if (err) {
            return res.status(500).json({ mensaje: 'Error en la petición' });
        }
        if (!plantasEncontradas || plantasEncontradas.length === 0) {
            return res.status(404).json({ mensaje: 'No hay plantas registradas para este cliente en esta sucursal.' });
        }

        return res.status(200).json({ plantas: plantasEncontradas });
    });
}


function eliminarPlantarolCliente(req, res) {
    

    const idPlanta = req.params.idPlanta;

    // Primero buscamos la planta para verificar su estado
    Planta.findById(idPlanta, (err, planta) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición al buscar la planta." });
        if (!planta) return res.status(404).send({ mensaje: "Planta no encontrada." });

        // Verificamos el estado de la planta
        if (planta.estado !== 'pendiente') {
            return res.status(400).send({
                mensaje: "Solo se pueden eliminar plantas con estado 'pendiente'."
            });
        }

        // Si está pendiente, procedemos a eliminar
        Planta.findByIdAndDelete(idPlanta, (err, eliminarPlanta) => {
            if (err) return res.status(500).send({ mensaje: "Error en la petición al eliminar la planta." });
            if (!eliminarPlanta) return res.status(404).send({ mensaje: "No se pudo eliminar la planta." });

            return res.status(200).send({ mensaje: "Planta eliminada exitosamente.", planta: eliminarPlanta });
        });
    });
}

function verPlantasPorId(req, res) {
   

    var idPlanta = req.params.idPlanta;

    Planta.findById(idPlanta, (err, plantaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!plantaEncontrada) return res.status(500).send({ mensaje: "Error al ver la planta" });
        return res.status(200).send({ plantas: plantaEncontrada });
    })

}



/* Editar Plantas*/
function editarPlantasRolCliente(req, res) {
 

  const idPlanta = req.params.idPlanta;
  const parametros = req.body;

  // Si hay imagen nueva, la agregamos
  if (req.file) {
    parametros.imagen = req.file.filename; // guardar solo el nombre del archivo
  }

  Planta.findByIdAndUpdate(idPlanta, { $set: parametros }, { new: true }, (err, plantaActualizada) => {
    if (err) return res.status(500).send({ mensaje: "Error en la petición" });
    if (!plantaActualizada) return res.status(404).send({ mensaje: "No se encontró la planta" });

    return res.status(200).send({ mensaje: "Planta editada exitosamente", planta: plantaActualizada });
  });
}


function verPlantasPorCliente(req, res) {
    

    var idUsuario = req.params.IdUsuario;

    Planta.find({ 'datosCliente.idUsuario': idUsuario }, (err, plantasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición." });
        if (!plantasEncontradas || plantasEncontradas.length === 0)
            return res.status(404).send({ mensaje: "No se encontraron plantas para este usuario." });

        return res.status(200).send({ plantas: plantasEncontradas });
    });
}


/* ver plantas por sucursal */
function verPlantasPorSucursal(req, res) {
    const idSucursal = req.params.idSucursal;

    if (!idSucursal) {
        return res.status(400).send({ mensaje: "ID de sucursal no proporcionado" });
    }

    Planta.find({ 
        datosSucursal: { $elemMatch: { idSucursal: idSucursal } } 
    })
    .exec((err, plantasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: "Error en la consulta: " + err });
        if (!plantasEncontradas || plantasEncontradas.length === 0) 
            return res.status(404).send({ mensaje: "No se encontraron plantas para esa sucursal" });
        return res.status(200).send({ plantas: plantasEncontradas });
    });
}


/* nuevo metodo de editar */
function nuevoEditarEstado(req, res) {
   

    var parametros = req.body;
    var idProducto = req.params.idPlanta;

    Planta.findByIdAndUpdate(idProducto, parametros, { new: true }, (err, plantasEncontradas) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!plantasEncontradas) return res.status(500).send({ mensaje: "Error al editar la planta" });
        return res.status(200).send({ plantas: plantasEncontradas });
    })
}

function agregarHistorial(req, res) {
    const idPlanta = req.params.idPlanta;
    const { tipo, mensaje, humedad_actual, metodo, precio } = req.body;

    Planta.findById(idPlanta, async (err, planta) => {
        if (err) return res.status(500).send({ mensaje: 'Error al buscar la planta' });
        if (!planta) return res.status(404).send({ mensaje: 'Planta no encontrada' });

        if (planta.estado !== 'entregada') {
            return res.status(400).send({ mensaje: 'Solo se puede agregar historial cuando el estado es entregada' });
        }

        const nuevoHistorial = new Historial({
            clienteId: req.user.sub,
            fecha: new Date(),
            tipo,
            mensaje,
            humedad_actual,
            metodo,
            precio // puede ser undefined
        });

        try {
            const historialGuardado = await nuevoHistorial.save();

            // Se agrega al array embebido sin _id si no lo necesitas
                            planta.datosHistorial.push({
                    _id: historialGuardado._id, // agrega el ID real
                    clienteId: historialGuardado.clienteId,
                    fecha: historialGuardado.fecha,
                    tipo: historialGuardado.tipo,
                    mensaje: historialGuardado.mensaje,
                    humedad_actual: historialGuardado.humedad_actual,
                    metodo: historialGuardado.metodo,
                    precio: historialGuardado.precio
                });

            await planta.save();

            // Convertimos _id a string antes de enviarlo
            const historialFormateado = {
                ...historialGuardado.toObject(),
                _id: historialGuardado._id.toString()
            };

            return res.status(200).send({
                mensaje: 'Historial agregado exitosamente',
                historial: historialFormateado
            });
        } catch (error) {
            return res.status(500).send({ mensaje: 'Error al guardar el historial', error });
        }
    });
}





function obtenerHistorialPorPlanta(req, res) {
    const idPlanta = req.params.idPlanta;

    Planta.findById(idPlanta, (err, plantaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la petición' });
        if (!plantaEncontrada) return res.status(404).send({ mensaje: 'Planta no encontrada' });

        // Retorna el historial completo embebido
        return res.status(200).send({
            mensaje: 'Historial de la planta encontrado',
            historial: plantaEncontrada.datosHistorial
        });
    });
}

/* editar historial */


function editarHistorial(req, res) {
    

    var parametros = req.body;
    var idHistorial = req.params.idHistorial;

    Historial.findByIdAndUpdate(idHistorial, parametros, { new: true }, (err, historialEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!historialEncontrado) return res.status(500).send({ mensaje: "Error al editar el historial" });
        return res.status(200).send({ productos: historialEncontrado });
    })
}



/* ver historial por id */
function verHistorialPorId(req, res) {
    var idHistorial = req.params.idHistorial;

    if (!mongoose.Types.ObjectId.isValid(idHistorial)) {
        return res.status(400).send({ mensaje: "ID inválido" });
    }

    Historial.findById(idHistorial, (err, historialEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error en la petición" });
        if (!historialEncontrado) return res.status(404).send({ mensaje: "Historial no encontrado" });
        return res.status(200).send({ historial: historialEncontrado });
    });
}


function eliminarHistorial(req, res) {
  const idHistorial = req.params.idHistorial;

  Historial.findById(idHistorial, (err, historial) => {
    if (err) return res.status(500).send({ mensaje: "Error al buscar el historial." });
    if (!historial) return res.status(404).send({ mensaje: "Historial no encontrado." });

    Historial.findByIdAndDelete(idHistorial, (err, historialEliminado) => {
      if (err) return res.status(500).send({ mensaje: "Error al eliminar el historial." });
      if (!historialEliminado) return res.status(404).send({ mensaje: "No se pudo eliminar el historial." });

      // Eliminar de plantas el objeto en datosHistorial que tenga el mismo mensaje
      Planta.updateMany(
        { "datosHistorial.mensaje": historialEliminado.mensaje },
        { $pull: { datosHistorial: { mensaje: historialEliminado.mensaje } } },
        (err, resultado) => {
          if (err) return res.status(500).send({ mensaje: "Error al limpiar el historial en plantas." });

          // Retornar éxito con info
          return res.status(200).send({
            mensaje: "Historial eliminado y referencias en plantas limpiadas.",
            historial: historialEliminado,
            resultado
          });
        }
      );
    });
  });
}



module.exports = {
    agregarPlanta,
    obtenerPlantasPorIdSucursal,
    getCategoriasRolCliente,
    eliminarPlantarolCliente,
    verPlantasPorId,
    editarPlantasRolCliente,
    verPlantasPorCliente,
    getCategoriasRolAdmin,
    verPlantasPorSucursal,
    nuevoEditarEstado,
    agregarHistorial,
    obtenerHistorialPorPlanta,
    editarHistorial,
    verHistorialPorId,
    eliminarHistorial

    
}
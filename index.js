const mongoose = require('mongoose');
const app = require('./app');
const bcrypt = require("bcrypt-nodejs");
const Usuarios = require('./src/models/usuarios.model');
const Tarjeta= require('./src/controllers/tarjetas.controller');
// const Tarjeta = require('./src/models/tarjetas.model'); // Ajusta la ruta

// BASE DE DATOS
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/EMPRESA_BROTES', {useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{

    console.log('Se encuentra conectado a la base de datos.');

    app.listen(3000,function(req, res){

        Tarjeta.RegistrarTarjetaUno(),
        Tarjeta.RegistrarTarjetaDos(),
        Tarjeta.RegistrarTarjetaTres(),
        Tarjeta.RegistrarTarjetaCuatro(),
        Tarjeta.RegistrarTarjetaCinco(),
        Tarjeta.RegistrarTarjetaSeis(),
        Tarjeta.RegistrarTarjetaSiete(),
        Tarjeta.RegistrarTarjetaOcho(),
        Tarjeta.RegistrarTarjetaNueve(),
        Tarjeta.RegistrarTarjetaDiez(),
        Tarjeta.RegistrarTarjetaOnce(),
        Tarjeta.RegistrarTarjetaDoce(),
        Tarjeta.RegistrarTarjetaTrece(),
        Tarjeta.RegistrarTarjetaCatorce(),
        Tarjeta.RegistrarTarjetaQuince(),
        Tarjeta.RegistrarTarjetaDieciseis(),
        Tarjeta.RegistrarTarjetaDiecisiete(),
        Tarjeta.RegistrarTarjetaDieciocho(),
        Tarjeta.RegistrarTarjetaDiecinueve(),
        Tarjeta.RegistrarTarjetaVeinte(),

        console.log('El servidor corre sin problemas');  
        
    })

    RegistrarAdministradorDefecto();

    // agregarTarjeta(111, 'Juan Pérez');

}).catch(error =>console.log(error))


function RegistrarAdministradorDefecto() {
    Usuarios.findOne({ email: "admin@gmail.com" }, (err, AdministradorEncontrado) => {
        if (err) {
            return console.error('Error en la petición de la base de datos:', err);
        }

        if (AdministradorEncontrado) {
            console.log('Ya se encuentra registrado el administrador');
            return; // <- Muy importante para evitar duplicado
        }

        var usuarioModel = new Usuarios();

        usuarioModel.nombre = 'ADMIN';
        usuarioModel.apellido = 'ADMIN';
        usuarioModel.email = 'admin@gmail.com';
        usuarioModel.password = '123456@Intecap';
        usuarioModel.rol = 'ROL_ADMIN';
        usuarioModel.telefono = 12345678;
        usuarioModel.direccion = 'Calle Doreteo Guamuch Zona 5';
        usuarioModel.departamento = 'Guatemala';
        usuarioModel.municipio = 'Guatemala';
        usuarioModel.imagen = null;

        bcrypt.hash(usuarioModel.password, null, null, (err, passwordEncriptada) => {
            if (err) return console.error('Error al encriptar contraseña:', err);

            usuarioModel.password = passwordEncriptada;

            usuarioModel.save((err, usuarioGuardado) => {
                if (err) return console.error('Error al guardar usuario:', err);
                if (!usuarioGuardado) return console.error('No se pudo guardar el usuario');
                console.log('Administrador creado correctamente');
            });
        });
    });
}


  /* function agregarTarjeta(noTarjeta, nombreUsuario) {
    const nuevaTarjeta = new Tarjeta({
        noTarjeta,
        nombreUsuario
    });

    nuevaTarjeta.save()
        .then(tarjetaGuardada => {
            console.log('Tarjeta agregada:', tarjetaGuardada);
        })
        .catch(error => {
            console.error('Error al agregar la tarjeta:', error);
        });
} */
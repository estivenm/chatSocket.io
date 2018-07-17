'use strict'
var mysql;
var dataquery = {};
var connection;
class Config {
  constructor() {
      mysql = require('mysql');
      connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'chat'
      });
    } //fin del constructor

  insertMensaje(idChat, tpchat, tpM, id, autor, mensaje) {
      //variable para almacenar datos  que se insertaran en la BD
      dataquery = { idChat: idChat, tipoC: tpchat, tipoM: tpM, idUsuario: id, usuario: autor, mensaje: mensaje, ip: 123 };
      //Query para insertar un nuevo mensaje
      connection.query('INSERT INTO cht_conversacion set ?', dataquery,
        function(err, res) {
          //preguntar si el query es exitoso 
          if (err) {
            throw err;
          } else {
            // console.log('Mensaje registrado', res);
          }
        });
    } //fin funcion insertar mensajes

  insertSesion(idChat, id, token) {
      //variable para almacenar datos  que se insertaran en la BD
      dataquery = { idChat: idChat, idUsuario: id, token: token };
      //Query para insertaringreso de usuario
      connection.query('INSERT INTO cht_sesionlogs set ?', dataquery,
        function(err, res) {
          //preguntar si el query es exitoso 
          if (err) {
            throw err;
          } else {
            //  console.log('Sesion registrada', res);
          }
        });
    } //fin funcion insertar ingreso de usuario

  updateSesion(socketid) {
      connection.query('update cht_sesionlogs  set salida = now() where token = ?', socketid,
        function(err, res) {
          //preguntar si el query es exitoso 
          if (err) {
            throw err;
          } else {
            // console.log('llego', res);
          }
        });
    } //fin funcion actualizar salidad

} //fin clase config
module.exports = new Config();
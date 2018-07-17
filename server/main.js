var express = require('express');
//variable para ejecutar la libreria express
var app = express();
//crear servidor
var server = require('http').Server(app);
//variable con servidor y aplicacion http
var io = require('socket.io')(server);
var Sentencias = require('../Modelo/Sentencias');
//captura de pantalla
var webshot = require('webshot');
//parsear body para  poder leer formularios via post  
//var parser = require('body-parser');
//cuando se manda un json
//app.use(parser.json()); 
//deprecado por seguridad
//app.use(parser());
//codificar la urlformar segura
//app.use(parser.urlencoded({extended: true})); 
var options = {
  siteType: "html",
  streamType: "png",
  shosize: {
    width: "all",
    height: "all"
  }
};
//para guardar los mensajes de los usuarios
var messages = [];
var conCone = 0;
var totalc = 0;
//guadar los mensajes de solo un admin
var messagesA = [];
var userconect = [];
var cerrar = "";
var controladores = "";
var autoRes = "En breves segundos responderemos tus inquietudes."
var time = 1;


//middler wer  
app.use(express.static('public'));

//rustas res (/)
app.get('/MAICOL', function(req, res) {
  res.status(200).send("hola");
});
//conexion para usuario
var path = require('path');

//cambiar este endpoind por uno mas amigable 
app.get('/admin', function(req, res) {
  res.sendFile(path.resolve('public/indexAdmin.html'));
});

/*peticiones via post
app.post('/j', function (req, res) {
    //varibale  que almacena el name del formulario
    var mensaje = req.body.mensaje;
    console.log('mensaje', mensaje);
    var saludo = '';
    if (mensaje != ''){
        saludo = "Hola " + mensaje;
        res.send(saludo);
    }
});*/

//socket.on() escuchador de evetnos en el servidor
//socket.broadcast.emit >> enviar a todos los conectados un mensaje
//socket.emit('',) >> enviar 

//escuchar cuando se establece una conexion con el socket
io.on('connection', (socket) => {
  //notifiacar en consola cuando se conecta un nuevo cliente
  console.log("usuario nuevo conectado.");
  // socket.join(conectados);
  socket.on('conectado', (newconectados) => {
    //quitar al id del  usuario actual
    socket.leave(conectados);
    //unir
    socket.join(newconectados);
    conectados = newconectados;
    console.log("mensaje desde on conectado" + conectados);
    //socket.emit('conectado', newconectados);
  });

  //escuchador de  escribiendo
  socket.on('escribiendo', (mensaje) => {
    io.sockets.emit('escribiendo', mensaje);
  });
  //escuchador de  mensajes de Administrador
  socket.on('new-msgA', (datoA) => {
    messagesA = datoA;
    console.log("mensaje desde onew-msgA " + messagesA.idU);
    //insetar mensajes en la bd
    // Sentencias.insertMensaje(datoA.idChat, datoA.tpchat, datoA.tpM, datoA.idU, datoA.author, datoA.text);
    //enviar mensaje a usuario seleccionado.
    for (var i in userconect) {
      if (userconect[i].id == datoA.idU) {
        //cambiar estado de idu2  X  id de usuario actual
        messagesA.idU2 = datoA.idU;
        autoRes = messagesA.autoRes
      } else {
        messagesA.idU2 = ""
      }
    }
    io.sockets.emit('new-msgA', messagesA);
    // io.sockets.emit('messages', messages, cerrar);
    //io.sockets.in(conectados).emit('new-msgA',messagesA);
  });
  socket.on('config:autores', (config) => {
    autoRes = config.respuesta
    time = config.time
  });

  //escuchar disponibilidad de chat para los usuarios
  socket.on('cerrar', (data, dataid) => {
    cerrar = data;
    console.log(data);
    //emitir a todos los usuarios conectados a excepcion del que realiza el evento 
    io.sockets.emit('cerrar', cerrar, dataid);
  });

  //escuchar contenido mensajes de chat cerrado, con usuario seleccionado.
  socket.on('contConversar', (dchatCerrado, idU) => {
    var ccc;
    ccc = { idU: dchatCerrado };
    // console.log("conversar id:" + idU);
    //console.log("conversar contenido:" + ccc.idU);
    io.sockets.emit('contConversar', ccc, idU);
    //emitir a todos los usuarios conectados a excepcion del que realiza el evento
    //socket.broadcast.emit('controladores', controladores, dataid);
  });
  //escuchar el tipo de control de botones para usuario (alerta,mutear,bloquear,dar palabra)
  socket.on('controladores', (bandera, contenidomsg) => {
    controladores = bandera;
    console.log(bandera);
    //emitir a todos los usuarios conectados a excepcion del que realiza el evento
    socket.broadcast.emit('controladores', controladores, contenidomsg);
  });

  //escuchar si  un usuario pidio la palabra
  socket.on('pedirPalabra', (data) => {
    console.log(data);
    //emitir a todos los usuarios conectados a excepcion del que realiza el evento
    socket.broadcast.emit('pedirPalabra', data);
  });
  //emitir mensajes  
  // socket.emit('messages', messages); 

  //escuchar un mensaje que llega  desde el navegador de un usuario
  socket.on('new-msg', (data) => {
    data.autoRes = autoRes;
    data.time = time;
    //agregar mensajes del cliente en la variable
    messages = data;
    //agregar  usuario a conectados
    if (data.text == "se ha conectado" && data.fecha == "") {
      data.socketid = socket.id;
      if (data.author != "Admin") {
        //insertar ingreso de usuario en la bd
        // Sentencias.insertSesion(data.idChat, data.id, data.socketid);
        conCone = conCone + 1;
        totalc = totalc + 1;
      }
      data.conet = " Usuarios activos " + conCone + " de " + totalc;
      //console.log("data.conet", data.conet);
      messages = data;
      userconect.push(messages);
      //emitir  cliente nuevo conectado con los controles de cliente
      io.sockets.emit('conectados', userconect);
      //emitir el tipo de control de chat para clientes (apagago, abierto,cerrado,controlado)     
      io.sockets.emit('cerrar', cerrar, userconect);
      //emitir el tipo de control de botones para clientes (alerta,mutear,bloquear,dar palabra)
      io.sockets.emit('controladores', controladores, userconect);

    } else {
      //insetar mensajes de usuario en la bd
      // Sentencias.insertMensaje(data.idChat, data.tpchat, data.tpM, data.id, data.author, data.text);
    }
    //emiter a todos los usuarios conectados el nuevo mensaje.
    io.sockets.emit('messages', messages, cerrar);
    //captura pantalla con node
    /*webshot(data.texto,'public/cp.png', options, function(err) {
          if(err){
            return console.log(err);
        }
        data.imagen = 'cp.png';
        messages = data;
        console.log("se guardo la  captura de pantalla.");
    });

    io.sockets.emit('messages', messages, cerrar);
    */

    //io.sockets.in(conectados).emit('messages',messages);
  }); //fin del on new msg  cd

  //Mensaje cuando un usuario se desconeta.   
  socket.on('disconnect', () => {
    //iterar sobre las propiedades  de userconect
    for (var prop in userconect) {
      //if para conocer  id  de socket desconectado
      //console.log('obj.' + prop, '=', userconect[prop]);
      if (userconect[prop].socketid == socket.id) {
        //descontar un usuario conectado, si es diferente de admin
        if (userconect[prop].author != "Admin") {
          conCone = conCone - 1;
          if (conCone < 0) {
            conCone = 0;
          }
          //actualizar contador de uduarios activos y total conectados
          userconect[prop].conet = "Usuarios activos " + conCone + " de " + totalc;
          //actualiazar en la bd hora desconecion usuario
          // Sentencias.updateSesion(userconect[prop].socketid);
          io.sockets.emit('conectados', userconect);
          //eliminar del objeto userconect el  cliente desconectado
          userconect.splice(prop, 1);
        }
      }
      if (userconect[prop]) {
        //actualizar contador de usuario activos y total conectados
        userconect[prop].conet = "Usuarios activos " + conCone + " de " + totalc;
        //console.log('userconect[prop]', userconect[prop]);
        io.sockets.emit('conectados', userconect);
      }
    }

    //limpiar propiedades de messages
    /*messages.text = "";
    messages.fecha = "";*/

    //userconect.conet = "activos "+ conCone+" de " + totalc;
    //emitir la nueva lista de clientes conectados
    //io.sockets.emit('conectados',userconect);
    //console.log('totalc en desconectado', totalc);
    //io.sockets.emit('messages', messages, cerrar,controladores, userconect);
    //emiter a todos los usuarios conectados el nuevo mensaje.
    socket.broadcast.emit('descone', { text: " Un usuario  se ha desconetado.", socket: socket.id });
    //mostrar en consola cuando un usuario se desconecta
    console.log("Un usuario se ha desconetado.");
  }); // fin del disconnect
}); // fin del conection

server.listen(8080, () => {
  console.log("aplicacion corriendo correctamente..");
});
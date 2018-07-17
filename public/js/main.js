var socket = io.connect('http://localhost:8080');
//fecha de sistema
var fecha = new Date();
//var fechaHor = fecha.toLocaleTimeString();
var fechaC = fecha.toLocaleString();
var ctlrChat;
var split;
//variables  de  cliente
var userc;
var idUserc;
var time;
//variables de  admin
var idUser;
var user = "";
var texto = [];
var contenidoMsg = {};
var palabra = [];
var conversarUser;
var contenido;
var ccc = [];
var dchatCerrado;
var controlAuto = [];
var control = "0";
'use strict'
$(document).ready(function() {
  //generar id de cliente  y nombre de cliente aleatorios.
  $("#idUserc").val(Math.floor((Math.random() * 100) + 1));
  $("#userc").val("cliente" + $("#idUserc").val());
  //generar id de admin y nombre aleatorios.
  $("#idUser").val(Math.floor((Math.random() * 100) + 1));
  $("#user").val("Admin");

  var bandera;

  $("#converContenido").fancybox({
    'transitionIn': 'none',
    'transitionOut': 'none',
    'speedIn': 5000,
    'speedOut': 200,
    'overlayShow': false,
    'overlayColor': 'red',
    'closeEffect': 'elastic',
    beforeClose: function() {
      //Cambir id de de escribir mensajes
      $("#textoV").attr("id", "texto");
      $("#texto2").attr("id", "texto2");
      //Cambir id de subir imagen
      $("#imagenAV").attr("id", "imagenA");
      $("#imagenA2").attr("id", "imagenA2");
    }
  });

  //enviar datos de cliente conectado.    
  if ($("#idUserc").length > 0) {
    idUserc = $("#idUserc").val();
    userc = $("#userc").val();
    bienvenidadUser(idUserc, userc);
    document.cookie = "idUserc = " + idUserc;
    // obtener todo el contenido isertado en el local storage
    if (localStorage.getItem("valor")) {
      //var valor = readCookie("valor");
      //localStorage.removeItem("valor");
      //var valor = localStorage.getItem("valor");
      // $("#msgu").append(valor);
    } else {
      //alert("llego");
      document.cookie = "valor=";
    }
    //document.cookie = "valor=vacio";
  } else if ($("#idUser").length > 0) {
    idUser = $("#idUser").val();
    user = $("#user").val();
    bienvenidadUser(idUser, user);
  }

  //Funcion  mostrar cliente conectado.
  function bienvenidadUser(id, user) {
    //Capturar datos cliente nuevo conectado.
    contenidoMsg = {
      socketid: '',
      idChat: 1,
      tpchat: ctlrChat,
      tpM: "M",
      id: parseInt(id),
      author: user,
      text: "se ha conectado",
      fecha: '',
      conet: ''

    };
    //enviar datos de cliente nuevo conectado
    socket.emit('new-msg', contenidoMsg);
  } //fin funcion  mostrar cliente conectado.

  ctlrChat = $('input:radio[name=ctlrChat]:checked').val();
  //cambiar id actual de mensajes de  cliente por id de cliente correspondiente.
  $("#msgu").attr('id', idUserc);
  //cambiar id actual de div bloqueo cliente por id de cliente correspondiente.
  $("#bloqueo").attr('id', 'bloqueo' + idUserc);
  //cambiar id actual de contenedor mensajes de cliente por id de cliente correspondiente.
  $("#elemmsg").attr('id', 'elemmsg' + idUserc);
  //cambiar id actual de  btnImagen  cliente por id de cliente correspondiente.
  $("#imagenc").attr('id', 'imagenc' + idUserc);
  //cambiar id actual de  controeles chat  cliente por id de cliente correspondiente.
  $("#ctrl").attr('id', 'ctrl' + idUserc);
  $("#infoChat").attr('id', 'infoChat' + idUserc);
  $(".inputfilec").prop('for', 'imagenc' + idUserc);

  //mensaje cuando admin no esta conectado
  if ($(".infoChat").text() == "") {
    $(".containeru").css("display", "none");
    $(".infoChat").text("Administrador Estiven Mazo no disponible.");
  }
  //Cambiar estado del chat  
  $('#cerrrarChat').click(function() {
    if ($("#cerrrarChat").hasClass("icon-chat-off")) {
      $("#cerrrarChat").removeClass("icon-chat-off");
      $("#cerrrarChat").addClass("icon-chat-on");
      bandera = "0";
    } else {
      $("#cerrrarChat").removeClass("icon-chat-on");
      $("#cerrrarChat").addClass("icon-chat-off");
      bandera = "1";
    }
    //emitir estado del chat  al servidor
    socket.emit('cerrar', bandera, idUserc);
  }); // fin de cambiar estado de  chat 

  //cambiar tipo de chat abierto cerrado o controlado
  $("input[name=ctlrChat]").change(function() {
    ctlrChat = $('input:radio[name=ctlrChat]:checked').val();
    if (ctlrChat == "controlado") {
      bandera = "002";
    } else if (ctlrChat == "cerrado") {
      bandera = "2";
    } else {
      bandera = "3";
    } // fin del if  cambiar tipo de chat abierto cerrado  o controlado
    contenidoMsg = {
      idU: idUserc,
      text: "Dar palabra"
    };
    socket.emit('cerrar', bandera, contenidoMsg);
  }); // fin de cambiar tipo de chat
  //cmabiar configurtacon de auto respuesta
  $(".btnConfig").click(function() {
    contenidoMsg = {
      time: $('.time').val(),
      respuesta: $('.autoR').val()
    }
    if (contenidoMsg.respuesta != "") {
      socket.emit('config:autores', contenidoMsg);
    } else {
      alert("Mensaje de autorespuesta no puede estar vacio.");
      $('.autoR').focus();
      return false;
    }
  });

  //deshabilitar o habilitar  chat para todos los clientes conectados,habilitar chat abierto  cerrado o controlado. 
  socket.on('cerrar', function(data, dataid) {
    console.log('data', data);
    switch (data) {
      //Habilitar chat
      case "0":
        llenar(".controlMsgu", idUserc),
          $(".infoChat").text("Chat en vivo (" + ctlrChat + ")");
        //apagar chat
        $("#cerrrarChat").removeClass("icon-chat-off");
        $("#cerrrarChat").addClass("icon-chat-on");
        //Mostrar contenido chat
        $(".containeru").css("display", "");
        break;
        //desabilitar chat
      case "1":
        $(".controlMsgu").html('');
        $("button.btnpalabra").removeAttr("disabled");
        //Mostrar contenido chat
        $(".containeru").css("display", "none");
        $(".infoChat").text("Chat desactivado");
        //apagar chat
        $("#cerrrarChat").removeClass("icon-chat-on");
        $("#cerrrarChat").addClass("icon-chat-off");
        break;
        //chat controlado
      case "002":
        ctlrChat = "controlado";
        console.log("en 002");
        $("#" + idUserc).attr('id', 'msgu');
        //Mostrar contenido chat
        $(".containeru").css("display", "");
        $("input[value='controlado']").prop('checked', 'checked');
        //cambiar colores controles
        $(".icon-chat-controlado").addClass("onControles");
        $(".icon-chat-cerrado-off > .path1").removeClass("onControles");
        $(".icon-chat-abierto-off > .path1").removeClass("onControles");
        //addcontrol usuario dar palabra Y tipo chat
        $(".icon-dar-palabra-on").css("display", "inline");
        $('.nameUserC').text("");
        $(".infoChat").text("Chat en vivo (Controlado)");
        //cambiar tipo de chat
        $(".icosTopu").addClass("icon-chat");
        $(".icosTopu").removeClass("icon-chat-directo");
        //remover controles chat y controles mensajes
        $(".controlMsgu").html('');
        $(".controlesChatu").html(`<span class="icon-icono-pedir-palabra-on lblControlesu" id="pedir-${idUserc}" onClick="pedirPalabra(id)"  title="Pedir palabra"></span>`);
        //remover estilos a controles mesajes
        $(".controlMsgu").removeClass("controlMsg");
        $(".contenedorText").css({ "padding": "0px" });
        break;
        //dar palabra  a usuario seleccionado
      case "02":
        console.log("en 02");
        ctlrChat = "controlado";
        $("#" + idUserc).attr('id', 'msgu');
        //Mostrar contenido chat
        $(".containeru").css("display", "");
        //$(".contenedormsg").html('<button type="button" id="pedir-'+idUserc+'" onClick="pedirPalabra(id)">Pedir palabra</button>');

        //dar palabra  a usuario seleccionado
        palabra[dataid.idU] = dataid.text;
        if (palabra[dataid.idU] == "palabra-on") {
          var name = "#elemmsg" + dataid.idU;
          llenar(name, dataid.idU);
          //add estilos a controles mesajes
          $("#elemmsg" + dataid.idU).removeClass("controlMsg");
          //$("bloqueo"+dataid.idU+">.contenedorText").css({ "padding": "15px" });
          $(".contenedorText").css({ "padding": "15px" });
        } else if (palabra[dataid.idU] == "palabra-off") {
          //remover controles chat t contrles mensajes
          $("#elemmsg" + dataid.idU).html('');
          $("#ctrl" + dataid.idU).html(`<span class="icon-icono-pedir-palabra-on lblControlesu" id="pedir-${dataid.idU}" onClick="pedirPalabra(id)" title="Pedir palabra"></span>`);
          //remover estilos a controles mesajes
          $("#elemmsg" + dataid.idU).removeClass("controlMsg");
          $(".contenedorText").css({ "padding": "0px" });
        } else {
          $("#btnpalabra-" + dataid.idU).addClass("pedir-palabra");
        }
        $("div").removeClass("sinL");
        //removercontrol usuario dar palabra,nombre usuario y agregar tipo de chat
        $(".infoChat").text("Chat en vivo (Controlado)");
        $(".icon-dar-palabra-on").css("display", "inline");
        $('.nameUserC').text("");
        break;
        //chat cerrado
      case "2":
        $("input[value='cerrado']").prop('checked', 'checked');
        console.log("en chat cerrado id de usuario es:" + idUserc);
        ctlrChat = "cerrado";
        $("#msgu").attr('id', idUserc);
        //Mostrar contenido chat
        $(".containeru").css("display", "");
        //add controlesmensajes a clientes conectados
        llenar(".controlMsgu", idUserc);
        //cambiar colores controles
        $(".icon-chat-controlado").removeClass("onControles");
        $(".icon-chat-cerrado-off > .path1").addClass("onControles");
        $(".icon-chat-abierto-off > .path1").removeClass("onControles");
        //removercontrol usuario dar palabra agregar tipo de chat y nombre usuario
        $(".infoChat").text("Chat en vivo (Cerrado)");
        $(".icon-dar-palabra-on").css("display", "none");
        //cambiar tipo de chat
        $(".icosTopu").addClass("icon-chat-directo");
        $(".icosTopu").removeClass("icon-chat");
        //add estilos a controles mesajes
        $(".controlMsgu").addClass("controlMsg");
        $(".contenedorText").css({ "padding": "15px" });
        break;
        //chat abierto
      case "3":
        $("#ctlrChatA").prop('checked', true);
        ctlrChat = "abierto";
        $("#" + idUserc).attr('id', 'msgu');
        //Mostrar contenido chat
        $(".containeru").css("display", "");
        //add controlesmensajes a clientes conectados
        llenar(".controlMsgu", idUserc);
        $("#textoc").focus();
        $("#idU").val("");
        $("div").removeClass("sinL");
        //cambiar colores controles
        $(".icon-chat-controlado").removeClass("onControles");
        $(".icon-chat-cerrado-off > .path1").removeClass("onControles");
        $(".icon-chat-abierto-off > .path1").addClass("onControles");
        //removercontrol usuario dar palabra agregar tipo de chat y nombre usuario
        $(".infoChat").text("Chat en vivo (Abierto)");
        $(".icon-dar-palabra-on").css("display", "none");
        $('.nameUserC').text("");
        //cambiar tipo de chat
        $(".icosTopu").addClass("icon-chat");
        $(".icosTopu").removeClass("icon-chat-directo");
        //add estilos a controles mesajes
        $(".controlMsgu").addClass("controlMsg");
        $(".contenedorText").css({ "padding": "15px" });
        break;
    } //fin del switch

  }); //fin del escuchador cerrar

  //subir archivos admin
  $("#imagenA").click(function() {
    subirImagen($(this).attr("id"));
  });
}); // fin del document ready 

// api google  AIzaSyBo7lXOAczJfTuqBsSl1VVSSKiGLg4EmoQ
// AIzaSyBIty2luTiltkKiPo65RJ4A-8HAqcV-Cvk

function captPantalla() {
  fecha = new Date();
  $("#preloader").addClass("preloader");
  $.ajax({
    type: "post",
    url: "../Controlador/captura/capturapantalla.php",
    data: {
      id: $('#idUserc').val()
    },
    success(respuesta) {
      var split2 = respuesta.split("##");
      if (split2[0] == "capturado") {
        contenidoMsg = {
          idChat: 1,
          tpchat: ctlrChat,
          tpM: "CP",
          id: $('#idUserc').val(),
          author: document.getElementById('userc').value,
          text: '@#!tm!#!@?',
          fecha: fecha.toLocaleTimeString(),
          tpArchivo: "image/png",
          texto: $('html').html(),
          imagen: '../Controlador/captura/' + $('#idUserc').val() + '/cp' + split2[1] + '.png'
        };
        socket.emit('new-msg', contenidoMsg);
        $("#preloader").removeClass("preloader");
      }
    }
  }); //fin del ajax
} //fin funcion captura de pantalla

//funcion para generar pdf de chat
function pdfChat() {
  //capturar conenido de chat
  var pdf = $(".contenMsg").html();
  //var pdf = pdf2.replace("</div></div>","</div></div><br>hola");
  //libreria para generar pdf
  var doc = new jsPDF();
  var margins = {
    top: 50,
    bottom: 60,
    left: 20,
    width: 522
  };
  var imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANwAAABaCAYAAADTszhEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTlGQ0QxMTZFN0MzMTFFNkE2RDhFNTMxM0Y0QjA2NjEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTlGQ0QxMTdFN0MzMTFFNkE2RDhFNTMxM0Y0QjA2NjEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxOUZDRDExNEU3QzMxMUU2QTZEOEU1MzEzRjRCMDY2MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxOUZDRDExNUU3QzMxMUU2QTZEOEU1MzEzRjRCMDY2MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pq5Mae0AABUbSURBVHja7F0LmBTV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';
  //parametros de imagen:imgen,tipo,left,top,width,heigth
  doc.addImage(imgData, 'png', 80, 10, 50, 20);
  doc.setFontSize(15)
    //parametros de texto:left,top
  doc.text(20, 45, fechaC)
    //add  a pdf html de conversacion con usuario
  doc.fromHTML(pdf,
    margins.left,
    margins.top, {
      'width': margins.width //max width of content on PDF
        //descargar pdf despues de terminar de cargar todo sdu contenido
    },
    function() {
      doc.save('historilchat.pdf');
    }, margins);
} //fin funcion generar pdf

//funcion para cononcer ubicacion
function ubicacion() {
  fecha = new Date();

  function localizacion(posicion) {
    var longitud = posicion.coords.longitude;
    var latitud = posicion.coords.latitude;
    //$("#map").text("latitud:"+latitud+" longitud:"+longitud);
    var imgURL = "http://maps.googleapis.com/maps/api/staticmap?center=" + latitud + "," + longitud + "&size=600x300&markers=color:red%7C" + latitud + "," + longitud + "&key=AIzaSyBIty2luTiltkKiPo65RJ4A-8HAqcV-Cvk";
    contenidoMsg = {
      idChat: 1,
      tpchat: ctlrChat,
      tpM: "AC",
      id: document.getElementById('idUserc').value,
      author: document.getElementById('userc').value,
      text: '@#!tm!#!@?',
      fecha: fecha.toLocaleTimeString(),
      tpArchivo: "image/jpg",
      imagen: imgURL
    };
    socket.emit('new-msg', contenidoMsg);
    //$("#map").html("<img src='"+imgURL+"'>");
  }
  navigator.geolocation.getCurrentPosition(localizacion);
} //fin funcion geolocalizacion

//funcion para subir archivos
function subirImagen(id) {
  fecha = new Date();
  //Subir imagen
  $("#" + id).on('change', function(e) {
    if ($("#" + id).val() != "") {
      $("#preloader").addClass("preloader");
    }
    var file = e.originalEvent.target.files[0];
    var lectura = new FileReader();
    lectura.onload = function(ev) {
        $("#preloader").removeClass("preloader");
        //img= ev.target.result;
        // enviar datos de cliente conectado.    
        if ($("#idUserc").length > 0) {
          contenidoMsg = {
            idChat: 1,
            tpchat: ctlrChat,
            tpM: "AC",
            id: document.getElementById('idUserc').value,
            author: document.getElementById('userc').value,
            text: '@#!tm!#!@?',
            fecha: fecha.toLocaleTimeString(),
            tpArchivo: file.type,
            imagen: ev.target.result
          };
          socket.emit('new-msg', contenidoMsg);
        } else if ($("#idUser").length > 0) {
          contenidoMsg = {
            idChat: 1,
            tpchat: ctlrChat,
            tpM: "AC",
            id: document.getElementById('idUser').value,
            idU: document.getElementById('idU').value,
            author: document.getElementById('user').value,
            text: '@#!tm!#!@?',
            fecha: fecha.toLocaleTimeString(),
            tpArchivo: file.type,
            imagen: ev.target.result
          };
          socket.emit('new-msgA', contenidoMsg);
        }
      } //fin de ondload lectura
    lectura.readAsDataURL(file);
    //limpiar btnsubirarchivo    
    $("#" + id).val("");
  }); //fin subir imagen
} //fin fucncion subir imagen

//Pedir palabra
function pedirPalabra(id) {
  split = id.split("-");
  socket.emit('pedirPalabra', split[1]);
} //fin funcion pedirPalabra

//Posicionar el scrolltop de cada mensaje al final
function scrollFinal() {
  //scroll para clientes
  if ($("#msg").length > 0) {
    $(".contenMsgA#msg").animate({
      scrollTop: $('.contenMsgA#msg')[0].scrollHeight
    }, 100);
  }
  //scroll admin
  if ($(".contenMsg").length > 0) {
    $(".contenMsg").animate({
      scrollTop: $('.contenMsg')[0].scrollHeight
    }, 100);
  }
} //fin funcion posicionar scroll

//Funcion enviar mensajes a cliente seleccionado
function mensaje(id) {
  split = id.split("-");
  //enviar el id del cliente Adm
  $("#idU").val(split[1]);
  $(".nameUserC").text("Para: " + split[2]);

} // fin funcion enciar mensaje a cliente selecionado

//Funcion enviar mensajes de alerta
function alerta(id) {
  split = id.split("-");
  //enviar el id del cliente Adm
  $("#idU").val(split[1]);
  bandera = "6";
  contenidoMsg = {
    idChat: 1,
    tpchat: ctlrChat,
    tpM: "AL",
    id: $("#idUser").val(),
    author: $("#user").val(),
    text: $("#texto").val(),
    idU: split[1],
    fecha: fecha.toLocaleTimeString()
  }; // fin funcion alerta
  socket.emit('new-msgA', contenidoMsg);
  socket.emit('controladores', bandera, contenidoMsg);
  document.getElementById('texto').value = "";
} //fin funcion mensaje de alerta 

//funcion para mutear cliente seleccionado
function mutear(id) {
  split = id.split("-");
  var mutear = split[1] + "-M";
  //desmutear usuario
  if ($("#btnSilenciar-" + split[1]).hasClass("icon-desmutear-off")) {
    $("#btnSilenciar-" + split[1]).removeClass("icon-desmutear-off");
    $("#btnSilenciar-" + split[1]).addClass("icon-mutear-off");
    bandera = "4";
    //enviar clase mutear usuario  en la posicion de id usuario
    texto[mutear] = "icon-mutear-off";
  } else {
    //mutear usuario
    $("#btnSilenciar-" + split[1]).removeClass("icon-mutear-off");
    $("#btnSilenciar-" + split[1]).addClass("icon-desmutear-off");
    bandera = "5";
    //enviar clase desmutear usuario en la posicion de id usuario
    texto[mutear] = "icon-desmutear-off";
  } //fin de mutear  a cliente selecionado
  contenidoMsg = {
    idU: split[1],
    text: texto[mutear]
  };
  socket.emit('controladores', bandera, contenidoMsg);
} //fin funcion mutear cliente seleccionado

//funcion bloquear cliente seleccionado
function bloquear(id) {
  split = id.split("-");
  var bloquear = split[1] + "-B";
  if ($("#btnBloquear-" + split[1]).hasClass("icon-bloquear-usuario")) {
    $("#btnBloquear-" + split[1]).removeClass("icon-bloquear-usuario");
    $("#btnBloquear-" + split[1]).addClass("icon-habilitar-usuario");
    bandera = "7";
    //enviar clase habilitar-usuario usuario  en la posicion de id usuario
    texto[bloquear] = "icon-habilitar-usuario";
  } else {
    $("#btnBloquear-" + split[1]).removeClass("icon-habilitar-usuario");
    $("#btnBloquear-" + split[1]).addClass("icon-bloquear-usuario");
    //enviar clase bloquear-usuario usuario  en la posicion de id usuario
    texto[bloquear] = "icon-bloquear-usuario";
    bandera = "8";
  } //fin de mutear  a cliente selecionado
  contenidoMsg = {
    idU: split[1],
    chat: ctlrChat,
    text: texto[bloquear]
  };
  socket.emit('controladores', bandera, contenidoMsg);
  //socket.emit('cerrar', bandera, contenidoMsg);
} // fin funcion bloquear cliente seleccionado

//funcion para dar palabra cliente seleccionado
function darpalabra(id) {
  split = id.split("-");
  // $("#idU").val(split[1]);
  //dar  palabra
  if ($("#btnpalabra-" + split[1]).hasClass("pedir-palabra")) {
    $("#btnpalabra-" + split[1]).removeClass("pedir-palabra");
    $("#btnpalabra-" + split[1]).addClass("palabra-on");
    texto[split[1]] = "palabra-on";
    bandera = "02";
    //quitar pedir palabra
  } else {
    $("#btnpalabra-" + split[1]).removeClass("palabra-on");
    bandera = "02";
    texto[split[1]] = "palabra-off";
  } //fin de quitar palabra a cliente selecionado
  contenidoMsg = {
    idU: split[1],
    text: texto[split[1]]
  };
  socket.emit('cerrar', bandera, contenidoMsg);
} //fin funcion dar palabra  cliente seleccionado

//llenar controles mensajes y controles chat
function llenar(name, id) {
  $("#ctrl" + id).html(`
                <span class="icon-icono-pantallazo-on lblControlesu" onClick="captPantalla()" title="Capturar pantalla"></span> 
                <span class="icon-descargar-pdf-on lblControlesu" onClick="pdfChat()" title="Descargar conversación"></span>
			    <span class="icon-enviar-ubicacion-on lblControlesu" onClick="ubicacion()" title="Enviar ubicación"></span>`);
  $(name).html(`<textarea name="mensaje" id="textoc" class="texto" placeholder="Escriba un mensaje" onkeyup="introC(event)"></textarea>
					<div class="controlMsg2">
						<button type="submit"  class="icon-enviar-on" id="btnEnvia" title="Enviar"></button>
						<input type="file" name="" class="inputfile" id="imagenc${id}" onclick="subirImagen(id)">
						<label for="imagenc${id}" class="icon-adjuntar-off inputfilec" title="Adjuntar"></label>
					</div>`);
} //fin funcion llenar controles mensajes y controles chat

//crear chat usuario
function contenedor(name, chat, id) {
  console.log(name, id, chat);
  $(name).html(`<div class="contenMsg" id="${chat}"></div>
                <div class="controlesChat controlesChatu" id="ctrl${id}">
			    <span class="icon-icono-pantallazo-on lblControlesu" onClick="captPantalla()" title="Capturar pantalla"></span>                
                <span class="icon-descargar-pdf-on lblControlesu" onClick="pdfChat()" title="Descargar coversaciòó"></span>
			    <span class="icon-enviar-ubicacion-on lblControlesu" onClick="ubicacion()" title="Enviar ubicación"></span>
                </div>
                <div class="contenedorText">
			    <form onsubmit="return addmessage(this)" id="formcHat">
				<input type="hidden" readonly="" name="" id="idUserc" placeholder="id" value="${id}">
				<input type="hidden" readonly="" name="" id="userc" placeholder="usuario" value="cliente${id}">
                <div class="controlMsg controlMsgu" id="elemmsg${id}">
					<textarea name="mensaje" id="textoc" class="texto" placeholder="Escriba un mensaje" onkeyup="introC(event)"></textarea>
					<div class="controlMsg2">
						<button type="submit" id="btnEnvia" class="icon-enviar-on" title="Enviar"></button>
						<input type="file" name="" class="inputfile" id="imagenc${id}" onclick="subirImagen(id)">
						<label for="imagenc${id}" class="icon-adjuntar-off inputfilec" title="Adjuntar"></label>
					</div>
				</div>
				<div id="preloader"></div>
			</form>
		</div>`);
} //fin funcion crear chat

//Enviar  mensajes cliente con enter
function introC(evento) {
  if (evento.keyCode === 13) {
    addmessage(evento);
  }
} //fin funcion intro insertar usuario

//Enviar  mensajes admin con enter
function introA(evento) {
  if (evento.keyCode === 13) {
    addmessages(evento);
  } else {
    escribiendo(evento.target.value);
  }
} //fin funcion intro insertar usuario

//funcion  mostrar escribiendo 
function escribiendo(value) {
  fecha = new Date();
  var data;
  if (value.length > 0) {
    data = {
      author: document.getElementById('user').value,
      texto: "escribiendo...",
      idU: document.getElementById('idU').value,
      fecha: fecha.toLocaleTimeString()
    }
  } else {
    data = {
      author: document.getElementById('user').value,
      texto: "",
      idU: document.getElementById('idU').value,
      fecha: fecha.toLocaleTimeString()
    }
  }
  socket.emit('escribiendo', data);
} //fin funcion escribiendo

//funcion leeer cookie
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
} //fin funcion leer cookie

//escuchador de eventos control de botones
socket.on('controladores', function(data, dataid) {
  console.log("bandera en on controladores:" + data)
  switch (data) {
    //habilitar chat cliente seleccionado
    case "4":
      var name = "#elemmsg" + dataid.idU;
      //add controles de chat y controles de mensajes
      llenar(name, dataid.idU);
      //cambiar estado de botones controles conectados
      $("#btnSilenciar-" + dataid.idU).removeClass("icon-desmutear-off");
      $("#btnSilenciar-" + dataid.idU).addClass("icon-mutear-off");
      //cambiar tipo de chat usuario silenciado
      $("#infoChat" + dataid.idU).text("Chat en vivo(" + ctlrChat + ")");
      //add estilos a controles mensajes
      $("#elemmsg" + dataid.idU).addClass("controlMsg");
      $(".contenedorText").css({ "padding": "15px" });
      break;
      //deshabilitar chat cliente seleccionado
    case "5":
      //remover controles chat,mensajes y remover clases
      $("#ctrl" + dataid.idU).removeClass("controlesChatu");
      $("#elemmsg" + dataid.idU).removeClass("controlMsgu");
      $("#ctrl" + dataid.idU).html('');
      $("#elemmsg" + dataid.idU).html('');
      //remover estilos a controles mesajes
      $("#elemmsg" + dataid.idU).removeClass("controlMsg");
      $(".contenedorText").css({ "padding": "0px" });
      //cambiar tipo de chat a usurio
      $("#infoChat" + dataid.idU).text("Chat en vivo (Silenciado)");
      //cambiar  estado de chat usuario seleccionado
      $("#btnSilenciar-" + dataid.idU).removeClass("icon-mutear-off");
      $("#btnSilenciar-" + dataid.idU).addClass("icon-desmutear-off");
      break;
      //alerta para cliente seleccionado
    case "6":
      //if para preguntar si exite el contenedor de cliente 
      if ($("#elemmsg" + dataid.idU).length > 0) {
        Push.create(dataid.author, {
          body: dataid.text,
          icon: 'logo.png',
          timeout: 5000,
          onClick: function() {
            this.close();
          }
        }); //fin de push alerta para el cliente
      } //fin if preguntar si exite el contenedor de cliente
      break;
      //Desbloquear el chat
    case "7":
      if (dataid.chat == "cerrado") {
        //add contendor chat
        contenedor("#bloqueo" + dataid.idU, dataid.idU, dataid.idU);
      } else {
        //add contendor chat
        contenedor("#bloqueo" + dataid.idU, "msgu", dataid.idU);
        // $("#bloqueo" + dataid.idU).html('<div id="msgu" class="contenMsg" style="height:170px; width: 400px; border: 1px solid #CCCCCC; padding: 12px;  border-radius: 5px; overflow-x: hidden;"></div><div class="contenedormsg" id="elemmsg' + dataid.idU + '"><textarea name="" id="textoc" placeholder="Escriba un mensaje"></textarea><br><input type="submit" name="" id="btnEnviar"> <input type="file" name="" onclick="subirImagen(id)" id="imagenc' + dataid.idU + '"></div>');
      }
      //cambiar estado de botones bloquear
      $("#btnBloquear-" + dataid.idU).removeClass("icon-bloquear-usuario");
      $("#btnBloquear-" + dataid.idU).addClass("icon-habilitar-usuario");
      $("#infoChat" + dataid.idU).text("Chat en vivo(" + ctlrChat + ")");
      break;
      //bloquear cliente seleccionado
    case "8":
      $("#infoChat" + dataid.idU).text("Chat en vivo (Bloqueado)");
      $("#bloqueo" + dataid.idU).html('<h1>Chat bloqueado.</h1>');
      //cambiar estado de botones bloquearr         
      $("#btnBloquear-" + dataid.idU).removeClass("icon-habilitar-usuario");
      $("#btnBloquear-" + dataid.idU).addClass("icon-bloquear-usuario");
      break;
  }
}); //fin escuchador eventos botones

//ecuchador de eventos cuando se pide la palabra
socket.on('pedirPalabra', function(data) {
  texto[data] = "pedir-palabra";
  bandera = "02";
  contenidoMsg = {
    idU: data,
    text: texto[data]
  };
  socket.emit('cerrar', bandera, contenidoMsg);
}); //fin de escuchador cuando se pide la palabra

//escuchador de eventos en el servidor (mensajes enviados por cliente)
socket.on('messages', function(data, cerrar) {
  capturar(data);
  scrollFinal();
  //console.log("userconect = %o " , userconect);
  //emitir el tipo de chat alos clientes nuevos.
  if (cerrar == "02") {
    //ctlrChat = "controlado";
    //$(".contenedormsg").html('<button type="button" id="pedir-'+idUserc+'" onClick="pedirPalabra(id)">Pedir palabra</button>');
    if (!palabra[data.id]) {
      palabra[data.id] = "palabra-off";
      //remover controles chat t contrles mensajes
      $("#elemmsg" + data.id).html('');
      $("#ctrl" + data.id).html(`<span class="icon-icono-pedir-palabra-on lblControlesu" id="pedir-${data.id}" onClick="pedirPalabra(id)" title="pedir palabra"></span>`);
      //remover estilos a controles mesajes
      $(".controlMsgu").removeClass("controlMsg");
      $(".contenedorText").css({ "padding": "0px" });
    }
  }
}); //fin escuchador de eventos en el servidor (mensajes enviados por cliente)

//mostrar los mensajes que llegan 
//map interator 
//join separador

//Escuchador para crear controles de cliente
socket.on('conectados', function(userconect) {
  if ($("#contenConectados").length > 0) {
    var B = "-B";
    var M = "-M";
    var sl = "-sl";
    //recuperar configuracion de controles de cada usuario conectado
    userconect.map(function(elem, index) {
      //mostrar cantidad de usuarios conectados
      $("#nroActivos").text(elem.conet);
      if (!texto[elem.id + "-M"]) {
        texto[elem.id + "-M"] = "icon-mutear-off";
      }
      if (!texto[elem.id + "-B"]) {
        texto[elem.id + "-B"] = "icon-habilitar-usuario";
      }
      if (!texto[elem.id]) {
        texto[elem.id] = "palabra-off";
      }
      if (!texto[elem.id + "-sl"]) {
        texto[elem.id + "-sl"] = "";
      }
    });
    //crear controles de usuario nuevo conectado y mantener controles de usuarios ya conectados
    var html = userconect.map(function(elem, index) {
      if (elem.author != "Admin") {
        return (`<div id='userconectado${elem.id}' class='${texto[elem.id + sl]} userconectado'>
                            <div class="infoUsuario">
                                        <span class="icon-icono-usuario-activo lblControles ${elem.socketid}" id="${elem.author}-${elem.id}" onClick=openconversar(id)>
                                            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span>
                                        </span>
                                        <span class="nameUser">${elem.author}</span>
                                    </div>
                                    <div class="ctrlUsuario">
                                        <span class="icon-dar-palabra-on ctrlUsuariohv ${texto[elem.id]}" id="btnpalabra-${elem.id}" onClick=darpalabra(id) title="Dar palabra"></span>
                                        <span class="icon-mensaje-directo-off ctrlUsuariohv" id="btnEnviarMsg-${elem.id}-${elem.author}" onClick=mensaje(id) title="mensaje"></span>
                                        <span class="${texto[elem.id + B]} ctrlUsuariohv" id="btnBloquear-${elem.id}" onClick=bloquear(id) title="Bloquear"></span>
                                        <span class="icon-alerta-off ctrlUsuariohv" id="btnAlerta-${elem.id}" onClick=alerta(id) title="Alerta"></span>
                                        <span class="${texto[elem.id + M]} ctrlUsuariohv" id="btnSilenciar-${elem.id}" onClick=mutear(id) title="Silenciar"></span>
                                    </div>
                             </div>`);

        /*
         <li id="conversar-${elem.id}" onClick=openconversar(id)><label id="linea-${elem.socketid}" style="color:#a8adb3">${elem.author} online </label></li>
      <button id="btnEnviarMsg-${elem.id}" onClick=mensaje(id)>Mensaje</button>
      <button id="btnAlerta-${elem.id}" onClick=alerta(id)>Alerta</button>
      <button id="btnSilenciar-${elem.id}" onClick=mutear(id)>${texto[elem.id + M]}</button>
      <button id="btnBloquear-${elem.id}" onClick=bloquear(id)>${texto[elem.id + B]}</button>
      <button type="button" class="btndarP" id="btnpalabra-${elem.id}" onClick=darpalabra(id)>${texto[elem.id]}</button>
                 
        
        var listaCookies = document.cookie;
alert(listaCookies);
var lista = document.cookie.split(";");
for (i in lista) {
var busca = lista[i].search(elem.id);
if (busca > -1) {micookie=lista[i]}
}
var igual = micookie.indexOf("=");
var valor = micookie.substring(igual+1);
alert(valor);*/
      }
    }).join(" ");
    //agregar cliente nuevo conectados con controles
    $("#contenConectados").html(html);
  }
}); //fin escuchador controles de cliente

//mostrar los mensajes que llegan desde el servidor a cliente y admin
function capturar(data) {
  //preguntar si existe contenedor de cliente conectado.
  if (data.text != "se ha conectado" && data.fecha != "") {
    //habilitar chat  abierto cerrado controlado.
    if (ctlrChat == "cerrado") {
      //no enviar nombre de archivo
      if (data.text != "@#!tm!#!@?") {
        //mostrar mensaje enviados por admin a cliente margin-left: 9px;  margin-right: 9px;
        $("#" + data.id).append($('<div class="msgbody"><div class="msgCuerpo"><div class="name"> ' + data.author + '</div>' + data.text + '<div class="tiempo">' + data.fecha + '</div></div></div>'));
        //agregar mensajes enviados por cliente a administrador
        $("#msg").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name"> ' + data.author + '</div>' + data.text + '<div class="tiempo">' + data.fecha + '</div></div></div>'));

        //recorer arreglo de autoespuestas            
        for (var i in controlAuto) {
          //validar si la autorespuesta esta activa
          if (controlAuto[i].id == data.id && controlAuto[i].control == "1") {
            control = "1";
            controlAuto[i].control = "0";
          }
        }
        //enviar auto respuesta despues de un determinado tiempo  
        if (data.respuesta == "A" && control == "1") {
          //desactivar autorespuesta apara usuario seleccionado
          control = "0";
          time = setTimeout(() => {
            fecha = new Date();
            $("#" + data.id).append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name">Admin</div>' + data.autoRes + '<div class="tiempo">' + fecha.toLocaleTimeString() + '</div></div></div>'));
            scrollFinal();
          }, 6000)
        }
      }
      //preguntar si se ha subido una imagen
      if (data.imagen) {
        //tipo de archivo Que se sube
        if (data.tpArchivo == "image/jpeg" || data.tpArchivo == "image/jpg" || data.tpArchivo == "image/png" || data.tpArchivo == "image/gif") {
          $("#" + data.id).append($('<div class="msgbody"><div class="msgCuerpo"><div class="name"> ' + data.author + '</div><a target= blank href="' + data.imagen + '" download><img src="' + data.imagen + '"style ="width:150px"/></a><div class="tiempo"> ' + data.fecha + '</div></div><br></div>'));
          $("#msg").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name">' + data.author + '</div><a target= blank href="' + data.imagen + '" download><img src="' + data.imagen + '"style ="width:150px;"/></a><div class="tiempo"> ' + data.fecha + '</div></div><br></div>'));
        } else {
          $("#" + data.id).append($('<div class="msgbody"><div class="msgCuerpo"><div class="name">' + data.author + '</div><a class=" icon-adjunto-administrador" target= blank href="' + data.imagen + '"download><div class=" icon-adjunto-administrador"><span class="path2"></span><span class="path3"></a></span></div><div class="tiempo">' + data.fecha + '</div></div><br></div>'));
          //agregar  imagenes enviadas por cliente a administrador
          $("#msg").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name">' + data.author + '</div><a class=" icon-adjunto-administrador" target= blank href="' + data.imagen + '" download><div class=" icon-adjunto-administrador"><span class="path2"></span><span class="path3"></span</a></div><div class="tiempo"> ' + data.fecha + '</div></div><br></div>'));
        }
      } //fin if preguntar si existe una imagen
      //add a arreglo cotenido de char usuario seleccionado
      if ($("#idUserc").length > 0) {
        dchatCerrado = $("#" + data.id).html();
        $("#resultadoConversa").html(ccc[data.id]);
        if (data.id == idUserc) {
          //emitir contenido chat de cliente selecionado en chat cerrado
          socket.emit('contConversar', dchatCerrado, data.id);
        }
      }
    } else {
      //no enviar nombre de archivo
      if (data.text != "@#!tm!#!@?") {
        //mostrar mensaje enviados por admin a client
        $("#msgu").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name">' + data.author + '</div>' + data.text + '<div class="tiempo">' + data.fecha + '</div></div><br></div>'));
        //agregar mensajes enviados por cliente a administrador
        $("#msg").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name">' + data.author + '</div>' + data.text + '<div class="tiempo">' + data.fecha + '</div></div><br></div>'));
      }
      if (data.imagen) {
        if (data.tpArchivo == "image/jpeg" || data.tpArchivo == "image/jpg" || data.tpArchivo == "image/png" || data.tpArchivo == "image/gif") {
          $("#msgu").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name">' + data.author + '</div><a target= blank href="' + data.imagen + '" download><img src="' + data.imagen + '"style ="width:150px"/></a><div class="tiempo"> ' + data.fecha + '</div></div><br></div>'));
          //agregar  imagenes enviadas por cliente a administrador
          $("#msg").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name">' + data.author + '</div><a target= blank href="' + data.imagen + '" download><img src="' + data.imagen + '"style ="width:150px;"/></a><div class="tiempo"> ' + data.fecha + '</div></div><br></div>'));
        } else {
          $("#msgu").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name">' + data.author + '</div><a class="icon-adjunto-administrador" target= blank href="' + data.imagen + '" download><div class=" icon-adjunto-administrador"><span class="path2"></span><span class="path3"></span></div></a><div class="tiempo">' + data.fecha + '</div></div><br></div>'));
          //agregar  imagenes enviadas por cliente a administrador
          $("#msg").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name">' + data.author + '</div><a class="icon-adjunto-administrador" target= blank href="' + data.imagen + '" download><div  class=" icon-adjunto-administrador"><span class="path2"></span><span class="path3"></span></div></a><div class="tiempo">' + data.fecha + '</div></div><br></div>'));
        }
      }
      var z = 0;
      if ($(".contenMsg").length > 0) {
        var htmlcookies = $(".contenMsg").html();
        z = $.trim(htmlcookies);
        //asignar valor a local storage
        localStorage.setItem("valor", z);
        //document.cookie = "valor="+z;
      }
      //document.cookie = data.id = ""+$("#msgu").html()+"; xpires=Thu, 18 Dec 2017 12:00:00 UTC";
    } //fin del if habilitar chat abierto o controlado.
  } //fin del if preguntar si un suario esta conectado.  
} //fin  de la funcion capturar informacion de  cliente

//escuchar  contenido chat cerrado
socket.on('contConversar', function(data, idu) {
  //if(idu==idUserc){
  //alert("id en contConversar:"+idu);
  //alert("datos en contConversar:"+data);
  //console.log(data.idU);
  //asigar a arreglo chat de usuario seleccionado
  ccc[idu] = data.idU;
  //console.log("valor de arreglo" + ccc[idu]);
  //console.log("valor de id" + idu);
  if (idu == $("#idU").val()) {
    $("#resultadoConversa").html(ccc[idu]);
  } else {
    //add clase mensajes sin leer
    var sl = idu + "-sl";
    texto[sl] = "sinL";
    $("#userconectado" + idu).addClass("sinL");
  }
}); //fin escuchador contenido chat cerrado

//funcion para  conversar con usuario seleccionado
function openconversar(id) {
  split = id.split("-");
  //enviar el id del cliente Adm
  $("#idU").val(split[1]);
  conversarUser = split[0]
  console.log(conversarUser);
  //Cambir id de de escribir mensajes
  $("#texto").attr("id", "textoV");
  $("#texto2").attr("id", "texto");
  //Cambir id de subir imagen
  $("#imagenA").attr("id", "imagenAV");
  $("#imagenA2").attr("id", "imagenA");
  //agregar contenido de chat a fancybox
  //nombre de usuario
  $(".nameUserC").html(conversarUser);
  //contenido de chat
  $("#resultadoConversa").html(ccc[split[1]]);
  $("#userconectado" + split[1]).removeClass("sinL");
  texto[[split[1]] + "-sl"] = "";
  $("#converContenido").click();
} //Fin /funcion para  conversar con usuario seleccionado 

//funcion que se ejecuta desde el cliente, capturar datos desde la vista  del cliente;
function addmessage(e) {
  fecha = new Date();
  mensajec = $.trim($("#textoc").val());
  //buscar salto de linea y reeemplazor por un br
  var textarea_line = mensajec.replace(new RegExp("\n", "g"), "<br>");
  //validar campo de texto cliente no este vacio.
  if (mensajec == "" || mensajec == null) {
    $("#textoc").focus();
    return false;
  } else {
    contenidoMsg = {
      idChat: 1,
      tpchat: ctlrChat,
      tpM: "M",
      id: document.getElementById('idUserc').value,
      author: document.getElementById('userc').value,
      text: textarea_line,
      fecha: fecha.toLocaleTimeString(),
      respuesta: "A",
      autoRes: "En breves segundos responderemos tus inquietudes.",
      time: 1
    };
    var b = false;
    for (var i = 0; i < controlAuto.length; i++) {
      //validar que no exista autorespuesta de usuario
      if (controlAuto[i].id == contenidoMsg.id) {
        b = true;
      }
    }
    //add a arreglo nueva autorespuesta
    if (b == false) {
      controlAuto.push({ id: contenidoMsg.id, control: "1" });
      console.log("false");
    }
    //enviar mensajes  de cliente a servidor
    socket.emit('new-msg', contenidoMsg);
    //limpiar datos 
    document.getElementById('textoc').value = "";
    $("#textoc").focus();
    return false;
  } //fin del if validar campos vacios
} //fin de la funcion addmensajes de cliente

//funcion que se ejecuta desde admin , capturar datos desde la vista  del admin;
function addmessages(e) {
  fecha = new Date();
  mensajec = $.trim($("#texto").val());
  //buscar salto de linea y reeemplazor por un br
  var textarea_line = mensajec.replace(new RegExp("\n", "g"), "<br>");
  //validar campo de texto admin no este vacio.
  if (mensajec == "" || mensajec == null) {
    $("#texto").focus();
    return false;
    //validar que este seleccionado un tipo de chat.    
  } else if (!$('input[name=ctlrChat]:checked').val()) {
    alert("selecione un tipo de chat");
    return false;
    //validar cuando el chat es cerrado se seleciones un cliete para emitir mensaje
  } else if ($('input[name=ctlrChat]:checked').val() == "cerrado" && $("#idU").val() == "") {
    alert("selecione un usuario para enviar el mensaje.");
    return false;
  } else {
    contenidoMsg = {
      idChat: 1,
      tpchat: ctlrChat,
      tpM: "M",
      id: document.getElementById('idUser').value,
      author: document.getElementById('user').value,
      text: textarea_line,
      idU: document.getElementById('idU').value,
      idU2: "",
      fecha: fecha.toLocaleTimeString(),
      respuesta: "D",
      autoRes: $('.autoR').val()
    };
    //enviar mensajes al servidor
    socket.emit('new-msgA', contenidoMsg);
    //limpiar datos 
    document.getElementById('texto').value = "";
    /* socket.on("conectado", function (valor) { });
     socket.emit("conectado", contenidoMsg.idU);*/
    return false;
  } //fin del if validar campos vacios
} //fin funcion addmensajes de admin

//escuchador de eventos en el servidor  agregar  mensajes enviadospor el administrador
socket.on('new-msgA', function(dataA) {
  //limpiar escribiendo
  $(".escri").css("display", "none");
  $(".msgbodyD").removeClass("escri");
  //habilitar chat  abierto cerrado controlado.
  if (ctlrChat == "cerrado") {
    //no enviar nombre de archivo
    if (dataA.text != "@#!tm!#!@?") {
      //detener contador de tiempo de autorespuesta
      if (dataA.respuesta == "D" && dataA.idU == dataA.idU2) {
        clearTimeout(time);
        for (var i in controlAuto) {
          //activar autorespuesta usuario seleccionado
          if (controlAuto[i].id == dataA.idU) {
            controlAuto[i].control = "1";
          }
        }

      }
      //agregar mensaje enviados por admin a cliente 
      $("#" + dataA.idU).append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name"> ' + dataA.author + '</div>' + dataA.text + '<div class="tiempo">' + dataA.fecha + '</div></div></div>'));
      //agregar mensajes enviados por cliente a admin
      $("#msg").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name"> ' + dataA.author + '</div>' + dataA.text + '<div class="tiempo">' + dataA.fecha + '</div></div></div>'));
    }
    //preguntar si se ha subido una imagen
    if (dataA.imagen) {
      if (dataA.tpArchivo == "image/jpeg" || dataA.tpArchivo == "image/jpg" || dataA.tpArchivo == "image/png" || dataA.tpArchivo == "image/gif") {
        $("#" + dataA.idU).append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name"> ' + dataA.author + '</div><a target= blank href="' + dataA.imagen + '" download><img src="' + dataA.imagen + '"style ="width:150px"/></a><div class="tiempo"> ' + dataA.fecha + '</div></div><br></div>'));
        //agregar  imagenes enviadas por cliente a administrador y imagenes enviapos por si mismo
        $("#msg").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name">' + dataA.author + '</div><a target= blank href="' + dataA.imagen + '" download><img src="' + dataA.imagen + '"style ="width:150px;"/></a><div class="tiempo"> ' + dataA.fecha + '</div></div><br></div>'));
      } else {
        $("#" + dataA.id).append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name">' + dataA.author + '</div><a class=" icon-adjunto-administrador" target= blank href="' + dataA.imagen + '"download><div class=" icon-adjunto-administrador"><span class="path2"></span><span class="path3"></a></span></div><div class="tiempo">' + dataA.fecha + '</div></div><br></div>'));
        //agregar  imagenes enviadas por cliente a administrador y imagenes enviapos por si mismo                   
        $("#msg").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name">' + dataA.author + '</div><a class=" icon-adjunto-administrador" target= blank href="' + dataA.imagen + '" download><div class=" icon-adjunto-administrador"><span class="path2"></span><span class="path3"></span</a></div><div class="tiempo"> ' + dataA.fecha + '</div></div><br></div>'));
      }
    } //fin if preguntar si existe muna imagen
    if ($("#idU").val() != "") {
      dchatCerrado = $("#" + dataA.idU).html();
      //emitir contenido chat de cliente selecionado en chat cerrado
      if (dataA.idU == idUserc) {
        socket.emit('contConversar', dchatCerrado, dataA.idU);
      }
    }
  } else {
    //no enviar nombre de archivo
    if (dataA.text != "@#!tm!#!@?") {
      //agregar mensaje enviados por admin a cliente      
      $("#msgu").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name"> ' + dataA.author + '</div>' + dataA.text + '<div class="tiempo">' + dataA.fecha + '</div></div></div>'));
      //agregar mensajes enviados por cliente a admin
      $("#msg").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name"> ' + dataA.author + '</div>' + dataA.text + '<div class="tiempo">' + dataA.fecha + '</div></div></div>'));
    }
    //preguntar si se ha subido una imagen
    if (dataA.imagen) {
      //preguntar por el tipo de archivo
      if (dataA.tpArchivo == "image/jpeg" || dataA.tpArchivo == "image/jpg" || dataA.tpArchivo == "image/png" || dataA.tpArchivo == "image/gif") {
        $("#msgu").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name"> ' + dataA.author + '</div><a target= blank href="' + dataA.imagen + '" download><img src="' + dataA.imagen + '"style ="width:150px"/></a><div class="tiempo"> ' + dataA.fecha + '</div></div><br></div>'));
        //agregar  imagenes enviadas por cliente a administrador y imagenes enviapos por si mismo
        $("#msg").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name">' + dataA.author + '</div><a target= blank href="' + dataA.imagen + '" download><img src="' + dataA.imagen + '"style ="width:150px;"/></a><div class="tiempo"> ' + dataA.fecha + '</div></div><br></div>'));
      } else {
        $("#msgu").append($('<div class="msgbodyD"><div class="msgCuerpoD"><div class="name">' + dataA.author + '</div><a class=" icon-adjunto-administrador" target= blank href="' + dataA.imagen + '"download><div class=" icon-adjunto-administrador"><span class="path2"></span><span class="path3"></a></span></div><div class="tiempo">' + dataA.fecha + '</div></div><br></div>'));
        //agregar  imagenes enviadas por cliente a administrador y imagenes enviapos por si mismo                   
        $("#msg").append($('<div class="msgbody"><div class="msgCuerpo"><div class="name">' + dataA.author + '</div><a class=" icon-adjunto-administrador" target= blank href="' + dataA.imagen + '" download><div class=" icon-adjunto-administrador"><span class="path2"></span><span class="path3"></span</a></div><div class="tiempo"> ' + dataA.fecha + '</div></div><br></div>'));
      }
    } //fin if preguntar si existe una imagen
  } //fin del if habilitar chat abierto o controlado. 
  //agregar contenido de chat a fancybox
  /* $("#conversarUsuario").html(conversarUser);
  $("#resultadoConversa").html(contenido);*/
  scrollFinal();
}); //fin escuchador de eventos  emitidos  por el admin

//Mostrar cuando usuario se desconecta
socket.on('descone', function(descone) {
  /* Push.create("TrainMe",{
     body: descone.text,
     icon: 'logo.png',
     timeout: 5000,
     onClick: function () {
       this.close();
     }
   });//fin de push  mostrar cuando un cliente se desconecta */
  $('.' + descone.socket).addClass("icon-usuario-inactivo");
  $('.' + descone.socket).removeClass("icon-icono-usuario-activo");

}); //Fin escuchador usuario desconectado.

// escuchador escribiendo
socket.on('escribiendo', function(data) {
  //add escribiendo a mensajes
  if (!$(".escri").length > 0) {
    //escribiendo en chat cerrado
    if (ctlrChat == "cerrado") {
      $("#" + data.idU).append($('<div class="msgbodyD escri"><div class="msgCuerpoD"><div class="name">' + data.author + '</div> <span class="clr-escri">' + data.texto + '</span><div class="tiempo">' + data.fecha + '</div></div><br></div>'));
    } else {
      $("#msgu").append($('<div class="msgbodyD escri"><div class="msgCuerpoD"><div class="name">' + data.author + '</div> <span class="clr-escri">' + data.texto + '</span><div class="tiempo">' + data.fecha + '</div></div><br></div>'));
    }
  }
  //limpiar escribiendo 
  if (data.texto == "") {
    $(".escri").css("display", "none");
    $(".msgbodyD").removeClass("escri");
  }
  scrollFinal();
}); //fin escuchador escribiendo

//almacentro 
//autorizacion //
//carrea 43a numero 34  95 local 2  259  centro comercial almacentro
//horario continuo lunes aviernes
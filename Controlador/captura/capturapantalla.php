<?php
$id = $_POST['id'];
//obtner fecha del sistema
date_default_timezone_set("America/Bogota");
$date = date("Y-m-d-h-i-s");
// cifrar el nombre del archivo y la fecha en que se subio
$hash = hash('sha256', $id . $date);
$fecha = $hash;
$carpeta = $_SERVER['DOCUMENT_ROOT'] . "/ChatNode/Controlador/captura/". $id .'/';
//crear carpeta si no existe con el id de usuario      
if (!file_exists($carpeta)) {
	mkdir($carpeta, 0777, true);
}
//abrir el directorio en cual se guardara el archivo >>>>idUsuario<<<
opendir($carpeta);
//variable que almacena la carpeta y el nombre del archivo
$destino = $carpeta . 'cp'.$fecha.'.png';
//capturar pantalla
$im = imagegrabscreen();
imagepng($im, $destino);
imagedestroy($im);
$respuesta ="capturado##".$hash;
echo $respuesta;

?>
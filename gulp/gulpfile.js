var gulp = require('gulp'),
//minificar archivos css
css = require('gulp-minify-css'),
//servidor estatico
browserSync = require('browser-sync'),
//comprimir js
uglify = require('gulp-uglify'),
//manejador de errores 
plumber = require('gulp-plumber')
//minificar imagenes
imagemin = require('gulp-imagemin');
//recargar la pagina automaticamente despues de un cambio
var reload = browserSync.reload;
var gutil = require('gulp-util');

//creando tareas con gulp
gulp.task('hola2', function (){
	console.log('hola');
});

//creando tareas con gulp asincronicas callbacks
gulp.task('hola', function (as){
	setTimeout(function (){
		console.log('hola');
		as(); // funcion anonima
	},10000);
});

//creando tareas con gulp asinconicas callbacks
gulp.task('mundo',['hola'],function () {
	console.log('mundo');
});

//creando tareas con gulp 
gulp.task('css',() => {
	return gulp.src('./../public/css/estilos.css')//leer archivo
	//.pipe(css().on('error', css.logError))//capturar posibles errores en la tarea css
	.pipe(css({ outputStyle: 'compressed'}))//comprimir archivo css
	.pipe(gulp.dest('.css'))//escribir archivo css minificado en un nueva cp
	.pipe(reload({ stream : true})) //enviar cambios al navegador

});

//escuchador de cambios de archivos
gulp.task('watch',() =>{
	gulp.watch('./../public/estilos.css',['css']);
});

//servidor estatico expone los html y los archivos css sass ya compilados
gulp.task('server',['css'],() =>{
	browserSync({
		server :{
			baseDir :['./../public/','.css'] //tomar cambios de html y css
		}
	});
	//iniciar tarea watch
	gulp.start('watch');
});

//minificar js
gulp.task('js', function () {
 gulp.src('./../public/js/main.js')//leer archivo
 .pipe(plumber()) //manejador de errores
 //.pipe(babel({presets: ['es2015']}))
 //.pipe(uglify().on('error', gutil.log))
 .pipe(uglify({compress:true}))//conprimir archivo js
 .pipe(gulp.dest('.js'))//escribir archivo js minificado en un nueva js
});
//minificar imagenes
gulp.task('img',() =>{
	return gulp.src('./../captura/**/*.png')
	.pipe(imagemin())
    .pipe(gulp.dest('dist/images/'));
});
//tareas por defecto que se ejecutaran 
gulp.task('default',['css', 'js']);

/*ejecutando varias tareas
//tareas por defecto que se ejecutaran 
gulp.task('default',['hola','mundo']);*/

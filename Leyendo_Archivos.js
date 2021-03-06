 // JavaScript Document

		/*PARA QUE ESTO FUNCIONE TENEMOS QUE HACERLO DESDE UN SERVIDOR REMOTO, O CAMBIAR LOS PERMISOS EN EL NAVEGADOR PARA QUE NOS PERMITA ACCEDER EN LOCAL*/


"use strict";
var zonadatos,boton,botonE,espacio_asignado,ruta;

function inicio(){
	zonadatos=document.getElementById("zonadatos");/*ERROR REFORMADO, "document.getElementById" por "addEventListener", descubierto gracias a la consola del navegador chrome*/
	boton=document.getElementById("boton");
	boton.addEventListener("click",crear,false);
	
	
	
	/*PRIMER PARAMETRO ES EL ESPACIO QUE VA A OCUPAR EL SISTEMA DE ARCHIVOS, MEDIDO EN BITES, LO QUEREMOS EN MEGAS, POR ESO PONEMOS 1024 AL CUADRADO.
	ESTA INSTRUCCION PIDE PERMISO AL NAVEGADOR PARA PODER CREAR UN ESPACIO EN DISCO */
	
	navigator.webkitPersistentStorage.requestQuota(5*1024*1024, acceso);
}

function acceso(){
	
	/*PARAMETROS DEL METODO "RequestFileSystem":
		1º El tipo de espacio donde vamos a crear el sistema de archivo= PERSISTENT O TEMPORARY;
		2º De nuevo el espacio que queremos reservar para el sistema de archivos;
		3º La llamada a una funcion en caso de que tengamos exito en la creacion del sistema de archivos;
		4º La llamada a una funcion en caso de que NO tengamos exito en la creacion del sistema de archivos;*/
	
	window.webkitRequestFileSystem(window.PERSISTENT, 5*1024*1024, crearsis, errores);
	/*Al crear un sistema de archivos con "RequestFileSysten" se lanza un objeto "fileSystem",que se crea cuando "ABRIMOS o CREAMOS" un sistema de archivos, el cual tiene que ser capturado por la funcion que usamos dentro de este metodo.
	Esta lo captura a modo de parametro;*/
}

/*ESTA FUNCION RECIBE COMO PARAMETRO EL OBJETO "fileSystem" QUE LANZA AL FORMAR PARTE DE "RequestFileSystem", al que vamos a llamar "sistema".*/

function crearsis(sistema){
	/*sistema hace referencia al objeto "fileSystem", que se crea cuando abrimos o creamos un sistema de archivos con "RequestFileSystem".*/
	espacio_asignado=sistema.root;
	ruta="";
	mostrarSiExito();
}
function crear(){
	var archivo=document.getElementById("entrada").value;
	var dir=document.getElementById("dir").value;
	if(archivo!==""){
		archivo=ruta + archivo;
		espacio_asignado.getFile(archivo,{create:true, exclusive:false},mostrarSiExito,errores);
	}
	if(dir!==""){
		espacio_asignado.getDirectory(dir,{create:true, exclusive:false},mostrarSiExito,errores);
	}
}
function mostrarSiExito(){
	document.getElementById("entrada").value="";
	document.getElementById("dir").value="";
	zonadatos.innerHTML="";
	espacio_asignado.getDirectory(ruta, null, leerDirectorio,errores);
	
	/*EL METODO "getDirectory", cuando el segundo parametro es "null", quiere decir que no va a crear un directorio nuevo, 
	sino que va a mostrar el directorio en el que nos encontramos y lanza un objeto a la funcion "leerDirectorio" en forma de 
	parametro.
	Dicho objeto es el directorio donde nos encontramos*/
}
function leerDirectorio(directorio){
	
	/*El metodo "createReader()" accede a la lista de archivos y directorios en una ruta especificada y devuelve un objeto
	 "DirectoryReader", el cual contiene el metodo "readEntries", usado para leer archivos y directorios, este recibe dos
	 parametros: Dos llamadas a funciones--(exito,error).
	 En este caso lo que hemos hecho es abreviar codigo, en vez de crear mas funciones, hemos usado la nomenclatura del punto
	 para concatenar metodos y donde iria una llamada a funcion dentro de "readEntries", le hemos puesto una funcion anonima, 
	 lo cual simplifica bastante el codigo*/
	
	directorio.createReader().readEntries(function(files){
		if(files.length){
			listar(files);
		}
	},errores);
}
function listar(files){
	for(var i=0;i<files.length;i++){
		if(files[i].isFile){
			zonadatos.innerHTML+=files[i].name + "<br>";
		}
		else if(files[i].isDirectory){
			zonadatos.innerHTML+="<span class='directorio'>" + files[i].name + "</span><br>";
		}
	}
}

function errores(evento){
	/*Cuando se produce un error se lanza tambien un objeto que hay que capturar al que por convencion llamamos "e" o "evento";*/
	alert("Lo sentimos, la acción no se ha realizado correctamente. 'Código de error:'" + evento.code);
}


window.addEventListener("load",inicio,false);
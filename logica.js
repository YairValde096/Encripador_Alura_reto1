// Se define un arreglo de dos dimensiones con dos filas.
// La primera fila contiene las vocales en minúsculas, y la segunda fila
// contiene las palabras que las reemplazarán en el texto encriptado.
let tablaDeConversion = [['a', 'e', 'i', 'o', 'u'], ['ai', 'enter', 'imes', 'ober', 'ufat']]

// Variable global para almacenar el ID del elemento de entrada de texto.
let id = "";
let ejecucionInicial = true;
let primeraEncriptacion = true;
let primeraDesencriptacion = true;
let historialTextos = [];
let contador = 0;
const ingresoAudio = new Audio("Recursos/ingreso.mp3");
const ingresoAudio2 = new Audio("Recursos/ingreso2.mp3");
const salida = new Audio("Recursos/reinicia.mp3");
const no = new Audio("Recursos/no.mp3");



// Función que encripta el texto ingresado por el usuario.
function Verificar(Verificar) {
    if (ejecucionInicial) {
        let pantalla = document.getElementById("PantallaSalida");
        pantalla.innerHTML = "";
        pantalla.style.alignContent = "space-evenly";
        ejecucionInicial = false;
    }

    if (primeraEncriptacion && Verificar == 'Encriptar') {
        document.getElementById("PantallaSalida").innerHTML += "<div id='TextoSalidaEnc'><div id='TextoSalida'>Encriptados</div></div>";
        primeraEncriptacion = false;
    }
    if (primeraDesencriptacion && Verificar == 'Desencriptar') {
        document.getElementById("PantallaSalida").innerHTML += "<div id='TextoSalidaDes'><div id='TextoSalida'>Desencriptados</div></div>";
        primeraDesencriptacion = false;
    }
}

// Función que encripta el texto ingresado por el usuario.
function Encriptar() {

    // Se obtiene el texto de entrada del usuario desde el elemento de entrada de texto.
    const txt = document.getElementById("ingreso").value;
    if (!verificadorSintaxis(txt)) {
        return no.play() + alert("Se estan incumpliendo reglas. (El mensaje tiene mayusculas, acentos o esta vacio)");
    }

    // Variable para almacenar el texto encriptado resultante.
    let txtEncriptado = '';

    // Se recorre el texto de entrada carácter por carácter.
    for (let i = 0; i < txt.length; i++) {
        // Se busca el carácter actual en el arreglo de vocales.
        let encontrado = false;
        for (let j = 0; j < tablaDeConversion[0].length; j++) {
            if (txt[i] === tablaDeConversion[0][j]) {
                // Si se encuentra la vocal en el arreglo, se reemplaza con la palabra correspondiente
                // del arreglo de palabras.
                txtEncriptado += tablaDeConversion[1][j];
                encontrado = true;
                break;
            }
        }

        // Si no se encuentra la vocal en el arreglo, se deja el carácter original en el texto encriptado.
        if (!encontrado) {
            txtEncriptado += txt[i];
        }
    }
    Verificar("Encriptar");
    // Si es la primera vez que se encripta, se borra el contenido anterior de la salida
    if (overflow()) { return no.play() + alert("Se ha llegado al tamaño máximo del contenedor, favor de refrescar la página o utilizar el botón de borrar"); }

    // Se muestra el texto encriptado en la consola y se copia al portapapeles.
    //console.log(txtEncriptado); //Validación para pruebas.
    portapapeles(txtEncriptado);
    historialTextos.push(txtEncriptado);
    imprimirDiv("TextoSalidaEnc", "TextoSalidaEnc2", txtEncriptado);
    contador++;
    ingresoAudio.play();

}


// Función que desencripta un texto ingresado por el usuario
function Desencriptar() {

    const txt = document.getElementById("ingreso").value;
    let txtOriginal = '';
    if (!verificadorSintaxis(txt)) {
        return no.play() + alert("Se estan incumpliendo reglas. (El mensaje tiene mayusculas, acentos o esta vacio)");
    }

    for (let i = 0; i < txt.length; i++) {
        let encontrado = false;

        // Recorremos el segundo arreglo en búsqueda de la palabra correspondiente
        for (let j = 0; j < tablaDeConversion[1].length; j++) {
            if (txt.substring(i, i + tablaDeConversion[1][j].length) === tablaDeConversion[1][j]) {
                txtOriginal += tablaDeConversion[0][j];
                encontrado = true;
                i += tablaDeConversion[1][j].length - 1;
                break;
            }
        }

        // Si la palabra no se encuentra en el segundo arreglo, se agrega tal cual al texto original
        if (!encontrado) {
            txtOriginal += txt[i];
        }
    }

    // Si es la primera vez que se desencripta, se borra el contenido anterior de la salida
    Verificar("Desencriptar");
    if (overflow()) { return no.play() + alert("Se ha llegado al tamaño máximo del contenedor, favor de refrescar la página o utilizar el botón de borrar"); }
    portapapeles(txtOriginal);
    historialTextos.push(txtOriginal);
    imprimirDiv("TextoSalidaDes", "TextoSalidaDes2", txtOriginal);
    //console.log(txtOriginal); //Validación para pruebas
    contador++;
    ingresoAudio2.play();
}
//Funcion que confirma solo uso de minusculas y espacios
function verificadorSintaxis(texto) {
    if (texto == "") { return false }
    const regex = /^[a-z\s]*$/;
    return regex.test(texto);
}


// Función que imprime un mensaje en un elemento HTML
function imprimir(id, msj) {
    document.getElementById(id).innerHTML = msj;
}
function overflow() {
    const contenedor = document.getElementById('PantallaSalida');

    if (contenedor.scrollHeight > contenedor.clientHeight) {
        return true;
    }
}

// Función que imprime un mensaje en un elemento HTML con un botón para copiar el texto
function imprimirDiv(contenedor, id, msj) {
    const outputDiv = document.getElementById(contenedor);
    outputDiv.innerHTML += `
    <div id="Mensajes" class="aparece">
        <p>${msj}</p>
        <button id="${id}-btn${contador}" class="btn btn-primary" value=${contador} onclick="portapapeles(historialTextos[${contador}])">
            <img src="Recursos/icono-copy.png">
        </button>
    </div>
  `;
}

function portapapeles(msj) {
    // Copia el texto en el portapapeles del usuario
    navigator.clipboard.writeText(msj)
        .then(() => {
            //console.log("Mensaje copiado al portapapeles"); //Validación para pruebas
        })
        .catch((err) => {
            console.error('No se pudo copiar el mensaje: ', err);
        });
}
function limpiar() {
    salida.play();
    id = "";
    ejecucionInicial = true;
    primeraEncriptacion = true;
    primeraDesencriptacion = true;
    historialTextos = [];
    contador = 0;
    tablaDeConversion = [['a', 'e', 'i', 'o', 'u'], ['ai', 'enter', 'imes', 'ober', 'ufat']];

    document.body.innerHTML = `<div id="Logo" >
       
    <img id= "Logo"src="Recursos/PALETA_PANTALLA-02.png" alt="Logo">
    

</div>
<div id="frame1">
    <div id="Advertencia">Solo letras minúsculas y sin acentos, el mensaje se copiará automáticamente al portapapeles.</div> 
    <img id="alr"src="Recursos/Alert.png" alt="">
    
</div>

<div id="Botones" >
    
    
    <button id="BtnEncriptar" onclick="Encriptar()">Encriptar!</button>
    <button id="BtnDesencriptar" onclick="Desencriptar()">Desencriptar</button>
    <button id="trash" onclick="limpiar()"><img src="Recursos/trash.png"></button>

</div>
<div id="alerta"></div>
<div id="PantallaSalida" >
    <img src="Recursos/mascota.png">
    <div id="TextoSalida">Ningún mensaje fue encontrado
        <div id="TextoSalida2">Ingresa el texto que desees encriptar o desencriptar.</div>            
    </div>
</div>

<!--<input type="text" id="ingreso" placeholder="Ingrese el texto aqui" >-->
<textarea id="ingreso" cols="30" rows="10"placeholder="Ingrese el texto aqui"></textarea>`;
}



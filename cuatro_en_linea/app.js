var tablero = new Array();
var jugador;

window.onload = function () {
    var canvas = document.getElementById("tablero");
    var contexto = canvas.getContext("2d");
    this.cargarFondo(contexto);
    iniciarJuego();
}

function iniciarJuego() {
    limpiarTablero();
}

function limpiarTablero() {
    tablero = new Array();
    for(var i=0; i<6; i++){
        tablero[i] = new Array();
        for(var j=0; j<7; j++){
            tablero[i].push(0);
        }
    }
}

function cargarFondo(contexto) {
    var background = new Image();
    background.src = "imgs/background.png";
    background.onload = function(){
        contexto.drawImage(background,0,0);   
    }
}
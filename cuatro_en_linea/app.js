var tablero = new Array();
var canvas;
var contexto;
var jugador;
var fichaRoja;
var fichaAmarilla;
var turno;
var fichasTotales = 0;

window.onload = function () {
    canvas = document.getElementById("tablero");
    turno = document.getElementById("turno");
    contexto = canvas.getContext("2d");
    canvas.addEventListener('click', function(event) {
        var canvasLeft = canvas.offsetLeft + canvas.clientLeft,
        canvasTop = canvas.offsetTop + canvas.clientTop;
        var x = event.pageX - canvasLeft,
            y = event.pageY - canvasTop;    
        x = Math.trunc(x / 85);
        y = Math.trunc(y / 85);
        dibujarFicha(x,y);        
        localStorage.setItem('tablero', JSON.stringify(tablero));
        localStorage.setItem('jugador', jugador);
    }, false);
    iniciarJuego();
}

function reiniciarJuego() {
    localStorage.removeItem('tablero');
    limpiarTablero();
    jugador = 1;
}

function iniciarJuego() {
    limpiarTablero();
    jugador = 1;
}

function limpiarTablero() {
    fichasTotales = 0;
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    tablero = new Array();
    for(var i=0; i<7; i++){
        tablero[i] = new Array();
        for(var j=0; j<6; j++){
            tablero[i].push(0);
        }
    }
    this.cargarFondoYFichas(contexto);
}

function cargarFondoYFichas() {
    fichaRoja = new Image();
    fichaRoja.src = "imgs/roja.png";
    fichaAmarilla = new Image();
    fichaAmarilla.src = "imgs/amarilla.png";
    var background = new Image();
    background.src = "imgs/background.png";
    background.onload = function(){
        contexto.drawImage(background,0,0);   
        cargarLocalStorage();
    }    
}

function cargarLocalStorage() {
    var tableroLocalStorage = localStorage.getItem('tablero');
        if (tableroLocalStorage) {
            var tableroTemp = JSON.parse(tableroLocalStorage);
            for(var i=6; i>=0; i--){
                for(var j=5; j>=0; j--){
                    jugador = tableroTemp[i][j];
                    if (jugador != 0) {
                        dibujarFicha(i,j);
                    }
                }
            }
            jugador = localStorage.getItem('jugador');
            calcularTurno();
        }
}

function dibujarFicha(x,y) {
    var ficha = fichaRoja;
    if (jugador != 1) {
        ficha = fichaAmarilla;
    }
    if (tablero[x][y] == 0) {
        y = calcularYLibre(x);
        contexto.drawImage(ficha,x*83.8+7.5,y*84.2+7.5);
        tablero[x][y] = jugador;
        setTimeout(function () {
            fichasTotales++;
            calcularVictoria(x,y);
            calcularTurno();
        }, 50);
    } else {
        alert('Esa casilla se encuentra ocupada.');
    }
}

function calcularYLibre(x) {
    for(var j=5; j>=0; j--){
        if (tablero[x][j] == 0) {
            return j;
        }
    }
}

function calcularTurno() {
    if (jugador == 1) {
        jugador = 2;
        turno.innerHTML = "Turno del jugador Amarillo";
    } else {
        jugador = 1;
        turno.innerHTML = "Turno del jugador Rojo";
    }
}

function calcularVictoria(x,y) {
    var victoria = false;
    victoria = calcularVictoriaD(x,y);
    if (!victoria) {
        victoria = calcularVictoriaI(x,y);
    }
    if (!victoria) {
        victoria = calcularVictoriaAb(x,y);
    }    
    if (!victoria) {
        victoria = calcularVictoriaAbI(x,y);
    }    
    if (!victoria) {
        victoria = calcularVictoriaAbD(x,y);
    }
    if (!victoria) {
        victoria = calcularVictoriaArI(x,y);
    }    
    if (!victoria) {
        victoria = calcularVictoriaArD(x,y);
    }
    if (victoria) {
        var ganador = (jugador == 1 ? 'Rojo' : 'Amarillo');
        alert('Victoria del jugador '+ ganador + "!!!");
    } else {
        if (fichasTotales == 42) {
            alert('Empate!');
        }
    }
}

function calcularVictoriaD(x,y) {
    var esIgual = true;
    for(var i=x; i<x+4; i++){
        if (i > 6 || i < 0 || tablero[i][y] != jugador) {
            esIgual = false;
            break;
        }
    }
    return esIgual;
}

function calcularVictoriaI(x,y) {
    var esIgual = true;
    for(var i=x; i>x-4; i--){
        if (i > 6 || i < 0 || tablero[i][y] != jugador) {
            esIgual = false;
            break;
        }
    }
    return esIgual;
}

function calcularVictoriaAb(x,y) {
    var esIgual = true;
    for(var i=y; i<y+4; i++){
        if (i > 5 || i < 0 || tablero[x][i] != jugador) {
            esIgual = false;
            break;
        }
    }
    return esIgual;
}

function calcularVictoriaAbI(x,y) {
    var esIgual = true;
    var contador = 0;
    for(var i=y; i<y+4; i++){
        var j = x-contador;
        if (i > 5 || i < 0 || j > 6 || j < 0 || tablero[j][i] != jugador) {
            esIgual = false;
            break;
        }
        contador++;
    }
    return esIgual;
}

function calcularVictoriaAbD(x,y) {
    var esIgual = true;
    var contador = 0;
    for(var i=y; i<y+4; i++){
        var j = x+contador;
        if (i > 5 || i < 0 || j > 6 || j < 0 || tablero[j][i] != jugador) {
            esIgual = false;
            break;
        }
        contador++;
    }
    return esIgual;
}


function calcularVictoriaArD(x,y) {
    var esIgual = true;
    var contador = 0;
    for(var i=y; i>y-4; i--){
        var j = x+contador;
        if (i > 5 || i < 0 || j > 6 || j < 0 || tablero[j][i] != jugador) {
            esIgual = false;
            break;
        }
        contador++;
    }
    return esIgual;
}


function calcularVictoriaArI(x,y) {
    var esIgual = true;
    var contador = 0;
    for(var i=y; i>y-4; i--){
        var j = x-contador;
        if (i > 5 || i < 0 || j > 6 || j < 0 || tablero[j][i] != jugador) {
            esIgual = false;
            break;
        }
        contador++;
    }
    return esIgual;
}
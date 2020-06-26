var tablero = new Array();
var canvas;
var contexto;
var jugadorActual;
var fichaRoja;
var fichaAmarilla;
var labelTurno;
var fichasTotales = 0;
var juegoTerminado = false;

window.onload = function () {
    canvas = document.getElementById("tablero");
    labelTurno = document.getElementById("labelTurno");
    contexto = canvas.getContext("2d");
    canvas.addEventListener('click', function(event) {
        if (!juegoTerminado) {
            var canvasLeft = canvas.offsetLeft + canvas.clientLeft,
            canvasTop = canvas.offsetTop + canvas.clientTop;
            var x = event.pageX - canvasLeft,
                y = event.pageY - canvasTop;    
            x = Math.trunc(x / 85);
            y = Math.trunc(y / 85);
            if (dibujarFicha(x,y)) {
                setTimeout(function () {
                    calcularVictoria();   
                    calcularTurno();
                }, 50);
            }
            localStorage.setItem('tablero', JSON.stringify(tablero));
            localStorage.setItem('jugadorActual', jugadorActual);
        } else {
            alert('El juego a terminado, por favor reinicie.');
        }
    }, false);
    iniciarJuego();
}
function iniciarJuego() {
    limpiarTablero();
    jugadorActual = 1;
}

function reiniciarJuego() {
    juegoTerminado = false;
    localStorage.removeItem('tablero');
    iniciarJuego();
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
                    jugadorActual = tableroTemp[i][j];
                    if (jugadorActual != 0) {
                        dibujarFicha(i,j);
                    }
                }
            }
            jugadorActual = localStorage.getItem('jugadorActual');
            calcularVictoria();
            calcularTurno();
        }
}

function dibujarFicha(x,y) {
    var ficha = fichaRoja;
    if (jugadorActual != 1) {
        ficha = fichaAmarilla;
    }
    if (tablero[x][y] == 0) {
        y = calcularYLibre(x);
        contexto.drawImage(ficha,x*83.8+7.5,y*84.2+7.5);
        tablero[x][y] = jugadorActual;
        fichasTotales++;
        return true;
    } else {
        alert('Esa casilla se encuentra ocupada.');
        return false;
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
    if (jugadorActual == 1) {
        jugadorActual = 2;
        labelTurno.innerHTML = "Turno del jugador Amarillo";
    } else {
        jugadorActual = 1;
        labelTurno.innerHTML = "Turno del jugador Rojo";
    }
}

function calcularVictoria() {
    var victoria = false;
    for(var i=0; i<7; i++){
        for(var j=0; j<6; j++){
            if (!victoria) {
                victoria = calcularVictoriaD(i,j);
                if (!victoria) {
                    victoria = calcularVictoriaAb(i,j);
                }    
                if (!victoria) {
                    victoria = calcularVictoriaAbI(i,j);
                }    
                if (!victoria) {
                    victoria = calcularVictoriaAbD(i,j);
                }
            } else {
                break;
            }
        }
    }
    
    if (victoria) {        
        juegoTerminado = true;
        var ganador = (jugadorActual == 1 ? 'Rojo' : 'Amarillo');
        alert('Victoria del jugador '+ ganador + "!!!");
    } else {
        if (fichasTotales == 42) {
            juegoTerminado = true;
            alert('Empate!');
        }
    }
}

function calcularVictoriaD(x,y) {
    var esIgual = true;
    for(var i=x; i<x+4; i++){
        if (i > 6 || i < 0 || tablero[i][y] != jugadorActual) {
            esIgual = false;
            break;
        }
    }
    return esIgual;
}

function calcularVictoriaAb(x,y) {
    var esIgual = true;
    for(var i=y; i<y+4; i++){
        if (i > 5 || i < 0 || tablero[x][i] != jugadorActual) {
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
        if (i > 5 || i < 0 || j > 6 || j < 0 || tablero[j][i] != jugadorActual) {
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
        if (i > 5 || i < 0 || j > 6 || j < 0 || tablero[j][i] != jugadorActual) {
            esIgual = false;
            break;
        }
        contador++;
    }
    return esIgual;
}

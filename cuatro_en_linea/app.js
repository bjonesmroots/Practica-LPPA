var tablero = new Array();
var canvas;
var contexto;
var jugadorActual;
var fichaRoja;
var fichaAmarilla;
var labelTurno;
var fichasTotales = 0;
var juegoTerminado = false;
var resultados;

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
                    calcularVictoria(true);   
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
    cargarResultados();
}

function cargarResultados() {    
    resultados = localStorage.getItem('resultados');
    if (!resultados) {
        resultados = [];
    } else {
        resultados = JSON.parse(resultados);
    }
    armarTabla(resultados);
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
            calcularVictoria(false);
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

function calcularVictoria(guardar) {
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
        dibujarTextoVictoria(ganador);
        if (guardar) {
            guardarResultados({
                fecha : formatDate(new Date()),
                resultado : 'Ganador: Jugador' + ganador,
                imagen : canvas.toDataURL("image/png")
            });
        }
    } else {
        if (fichasTotales == 42) {
            juegoTerminado = true;
            dibujarTextoVictoria(null);
            if (guardar) {
                guardarResultados({
                    fecha : formatDate(new Date()),
                    resultado : 'Empate',
                    imagen : canvas.toDataURL("image/png")
                });
            }
        }
    }
}

function dibujarTextoVictoria(ganador) {
    contexto.font = "bold 30px Arial";
    contexto.fillStyle = "#00ff08";
    if (!ganador) {
        contexto.fillText('Empate!!!', 160, 250);
    } else {
        contexto.fillText('Victoria del jugador '+ ganador + '!!!', 110, 250);
    }
}

function dibujarLineaVictoria(x,y,x2,y2) {
    contexto.lineWidth = 5;
    contexto.strokeStyle = "#00802b";
    contexto.beginPath();
    contexto.moveTo(x, y);
    contexto.lineTo(x2, y2);
    contexto.stroke();
}

function guardarResultados(resultado) {
    resultados.push(resultado);
    localStorage.setItem('resultados', JSON.stringify(resultados));
    cargarResultados();
}

function calcularVictoriaD(x,y) {
    var esIgual = true;
    for(var i=x; i<x+4; i++){
        if (i > 6 || i < 0 || tablero[i][y] != jugadorActual) {
            esIgual = false;
            break;
        }
    }
    if (esIgual) {
        dibujarLineaVictoria(x*85+42.5,y*85+42.5,(x+4)*85-42.5,y*85+42.5);
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
    if (esIgual) {
        dibujarLineaVictoria(x*85+42.5,y*85+42.5,x*85+42.5,(y+4)*85-42.5);
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
    if (esIgual) {
        dibujarLineaVictoria(x*85+42.5,y*85+42.5,(x-3)*85+42.5,(y+3)*85+42.5);
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
    if (esIgual) {
        dibujarLineaVictoria(x*85+42.5,y*85+42.5,(x+3)*85+42.5,(y+3)*85+42.5);
    }
    return esIgual;
}



function armarTabla(resultados) {
    var col = [];
    col.push(['Fecha','fecha']);
    col.push(['Resultado','resultado']);
    col.push(['Captura','imagen']);
  
    var table = document.createElement("table");
  
    var tr = table.insertRow(-1);
  
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i][0];
        tr.appendChild(th);
    }
  
    for (var i = resultados.length - 1; i >= 0; i--) {  
        tr = table.insertRow(-1);  
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            var resultado = resultados[i][col[j][1]];
            if (col[j][1] == 'imagen') {
                var img = document.createElement("img");
                img.src = resultado;
                img.width = 100;
                img.alt = resultados[i][col[1][1]];
                img.className = "imgResultado"
                tabCell.appendChild(img);
            } else {
                tabCell.innerHTML = resultado;
            }
        }
    }
  
    var divContainer = document.getElementById("resultados");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);

    cargarModal();
}

function cargarModal() {
    var modal = document.getElementById("myModal");

    var imgs = document.getElementsByClassName("imgResultado");
    for (var i = imgs.length - 1; i >= 0; i--) { 
        imgs[i].onclick = function(){
            var modalImg = document.getElementById("img01");
            var captionText = document.getElementById("caption");
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.alt;    
        }
    }

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear() + "  " + strTime;
  }
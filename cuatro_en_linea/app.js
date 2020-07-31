var tablero = new Array();
var canvas;
var contexto;
var jugadorActual;
var fichaRoja;
var fichaAmarilla;
var fichaNegra;
var labelTurno;
var fichasTotales = 0;
var juegoTerminado = false;
var resultados;
var partidas;
var botonGuardar;
var tiempoRojo = 0;
var tiempoAmarillo = 0;
var tiempoNegro = 0;
var lblTiempoRojo;
var lblTiempoAmarillo;
var lblTiempoNegro;
var contenedorTiempoNegro;
var cantidadJugadores = 2;
var nombreJugadores = [];

window.onload = function () {    
    lblTiempoRojo = document.getElementById("tiempoRojo");
    lblTiempoAmarillo = document.getElementById("tiempoAmarillo");
    lblTiempoNegro = document.getElementById("tiempoNegro");
    contenedorTiempoNegro = document.getElementById("contenedorTiempoNegro");
    botonGuardar = document.getElementById("guardar_partida");
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
            guardarLocalStorage();
        } else {
            alert('El juego a terminado, por favor reinicie.');
        }
    }, false);
    cargarLocalStorage();
    if (!cantidadJugadores) {
        solicitarNombres();
    } else {
        iniciarJuego();
    }
    cargarResultados();
    cargarPartidasGuardadas();
}

function solicitarNombres() {
    juegoTerminado = true;
    var modal2 = document.getElementById("myModal2");
    modal2.style.display = "block";
    var form = this.document.getElementById("form");
    form.onsubmit = function(event) {
      event.preventDefault();
      nombreJugadores = new Array();  
      cantidadJugadores = parseInt(form.elements["cantidad_jugadores"].value);
      nombreJugadores.push(form.elements["nombre_rojo"].value);
      nombreJugadores.push(form.elements["nombre_amarillo"].value);
      nombreJugadores.push(form.elements["nombre_negro"].value);
      localStorage.setItem('nombreJugadores', JSON.stringify(nombreJugadores));
      modal2.style.display = "none";
      labelTurno.innerHTML = "Turno del jugador Rojo (" + nombreJugadores[0] + ")";
      juegoTerminado = false;
      iniciarJuego();
    }
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

function cargarPartidasGuardadas() {    
    partidas = localStorage.getItem('partidas');
    if (!partidas) {
        partidas = [];
    } else {
        partidas = JSON.parse(partidas);
    }
    armarTablaPartidas(partidas);
}

function iniciarJuego() {    
    if (cantidadJugadores == 3) {
        contenedorTiempoNegro.style.display = 'block'; 
    } else {
        contenedorTiempoNegro.style.display = 'none';
    }
    limpiarTablero();
    jugadorActual = 1;
    tiempoRojo = 0;
    tiempoAmarillo = 0;
    tiempoNegro = 0;
    guardarLocalStorage();
}

function contador() {
    if (!juegoTerminado && nombreJugadores.length > 0) {
        if (jugadorActual == 1) {
            tiempoRojo += 1;
        } else if (jugadorActual == 2) {
            tiempoAmarillo += 1;
        } else {
            tiempoNegro += 1;
        }
        lblTiempoRojo.innerHTML = nombreJugadores[0] + ': ' + tiempoRojo + ' segundos';
        lblTiempoAmarillo.innerHTML = nombreJugadores[1] + ': ' + tiempoAmarillo + ' segundos';
        lblTiempoNegro.innerHTML = nombreJugadores[2] + ': ' + tiempoNegro + ' segundos';
        setTimeout(contador, 1000);
    }
}

function reiniciarJuego(solicitarNom) {
    juegoTerminado = false;
    if (solicitarNom) {
        solicitarNombres();
    }
    botonGuardar.style.display = 'inline'; 
    localStorage.removeItem('tablero');
}


function limpiarTablero() {
    fichasTotales = 0;
    contexto.clearRect(0, 0, canvas.width, canvas.height);
    tablero = new Array();
    for(var i=0; i<10; i++){
        if (cantidadJugadores == 3 || i < 7) {
        tablero[i] = new Array();
            for(var j=0; j<9; j++){
                if (cantidadJugadores == 3 || i < 6) {
                    tablero[i].push(0);
                }
            }
        }
    }
    this.cargarFondoYFichas(contexto);
}

function cargarFondoYFichas() {
    fichaRoja = new Image();
    fichaRoja.src = "imgs/roja.png";
    fichaAmarilla = new Image();
    fichaAmarilla.src = "imgs/amarilla.png";
    fichaNegra = new Image();
    fichaNegra.src = "imgs/negra.png";
    var background = new Image();
    if (cantidadJugadores == 2) {
        background.src = "imgs/background.png";
        canvas.height = 518;
        canvas.width = 598;
    } else {
        background.src = "imgs/background_3.png";
        canvas.height = 592;
        canvas.width = 840;
    }
    background.onload = function(){
        contexto.drawImage(background,0,0);   
        cargarLocalStorage();
    }    
}

function cargarLocalStorage() {
    var tableroLocalStorage = localStorage.getItem('tablero');
    if (tableroLocalStorage) {
        cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
        var tableroTemp = JSON.parse(tableroLocalStorage);
        for(var i=9; i>=0; i--){
            if (i <=6 || cantidadJugadores == 3) {
                for(var j=6; j>=0; j--){
                    if (i <=5 || cantidadJugadores == 3) {
                        jugadorActual = tableroTemp[i][j];
                        if (jugadorActual != 0) {
                            dibujarFicha(i,j);
                        }
                    }
                }
            }
        }
        jugadorActual = localStorage.getItem('jugadorActual');
        tiempoAmarillo = parseInt(localStorage.getItem('tiempoAmarillo'));
        tiempoRojo = parseInt(localStorage.getItem('tiempoRojo'));
        tiempoNegro = parseInt(localStorage.getItem('tiempoNegro'));
        nombreJugadores = JSON.parse(localStorage.getItem('nombreJugadores'));
        calcularVictoria(false);
        calcularTurno();
        juegoTerminado = false;    
        contador();
    } else {        
        cantidadJugadores = parseInt(localStorage.getItem('cantidadJugadores'));
    }
}

function dibujarFicha(x,y) {
    var ficha = fichaRoja;
    if (jugadorActual == 2) {
        ficha = fichaAmarilla;
    } else if (jugadorActual == 3) {
        ficha = fichaNegra;
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
    for(var j=6; j>=0; j--){
        if (j <= 5 || cantidadJugadores == 3) {
            if (tablero[x][j] == 0) {
                return j;
            }
        }
    }
}

function calcularTurno() {    
    if (cantidadJugadores == 3) {
        contenedorTiempoNegro.style.display = 'block'; 
    } else {
        contenedorTiempoNegro.style.display = 'none';
    }
    if (jugadorActual == 1) {
        jugadorActual = 2;
        labelTurno.innerHTML = "Turno del jugador Amarillo (" + nombreJugadores[1] + ")";
    } else if (jugadorActual == 2 && cantidadJugadores == 3) {
        jugadorActual = 3;
        labelTurno.innerHTML = "Turno del jugador Negro (" + nombreJugadores[2] + ")";
    } else  {
        jugadorActual = 1;
        labelTurno.innerHTML = "Turno del jugador Rojo (" + nombreJugadores[0] + ")";
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
        var ganador = 'Rojo';
        if (jugadorActual == 2) {
            ganador = 'Amarillo';
        } else if (jugadorActual == 3) {
            ganador = 'Negro';
        }
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
    botonGuardar.style.display = 'none'; 
    if (resultados.length >= 7) {
        resultados.splice(0, 1);
    }
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
    var cont = 0;
    for(var i=y; i<y+4; i++){
        var j = x-cont;
        if (i > 5 || i < 0 || j > 6 || j < 0 || tablero[j][i] != jugadorActual) {
            esIgual = false;
            break;
        }
        cont++;
    }
    if (esIgual) {
        dibujarLineaVictoria(x*85+42.5,y*85+42.5,(x-3)*85+42.5,(y+3)*85+42.5);
    }
    return esIgual;
}

function calcularVictoriaAbD(x,y) {
    var esIgual = true;
    var cont = 0;
    for(var i=y; i<y+4; i++){
        var j = x+cont;
        if (i > 5 || i < 0 || j > 6 || j < 0 || tablero[j][i] != jugadorActual) {
            esIgual = false;
            break;
        }
        cont++;
    }
    if (esIgual) {
        dibujarLineaVictoria(x*85+42.5,y*85+42.5,(x+3)*85+42.5,(y+3)*85+42.5);
    }
    return esIgual;
}



function armarTabla(resultados) {
    if (resultados.length > 0) {
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
                var valor = resultados[i][col[j][1]];
                if (col[j][1] == 'imagen') {
                    var img = document.createElement("img");
                    img.src = valor;
                    img.width = 100;
                    img.alt = resultados[i][col[1][1]];
                    img.className = "imgResultado"
                    tabCell.appendChild(img);
                } else {
                    tabCell.innerHTML = valor;
                }
            }
        }
    
        var divContainer = document.getElementById("resultados");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }

}

function cargarModales() {
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
    var modal2 = document.getElementById("myModal2");
    var span2 = document.getElementsByClassName("close")[1];

    span2.onclick = function() {
        modal2.style.display = "none";
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

function armarTablaPartidas(partidas) {
    if (partidas.length > 0) {
        var col = [];
        col.push(['Captura','imagen']);
        col.push(['Fecha','fecha']);
        col.push(['Recuperar','recuperar']);
    
        var table = document.createElement("table");
    
        var tr = table.insertRow(-1);
    
        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");
            th.innerHTML = col[i][0];
            tr.appendChild(th);
        }
    
        for (var i = partidas.length - 1; i >= 0; i--) {  
            tr = table.insertRow(-1);  
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                var valor = partidas[i][col[j][1]];
                if (col[j][1] == 'imagen') {
                    var img = document.createElement("img");
                    img.src = valor;
                    img.width = 100;
                    img.alt = partidas[i][col[1][1]];
                    img.className = "imgResultado"
                    tabCell.appendChild(img);
                } else if (col[j][1] == 'recuperar') {
                    var btn = document.createElement("button");
                    btn.innerHTML = 'Recuperar';
                    btn.value = i;
                    btn.onclick = function recuperarPartida() {
                        reiniciarJuego(false);
                        setTimeout(() => {            
                            juegoTerminado = true;    
                            localStorage.setItem('tablero',JSON.stringify(partidas[this.value].tablero));
                            localStorage.setItem('jugadorActual',partidas[this.value].jugadorActual);
                            localStorage.setItem('tiempoRojo',partidas[this.value].tiempoRojo);
                            localStorage.setItem('tiempoAmarillo',partidas[this.value].tiempoAmarillo);
                            localStorage.setItem('tiempoNegro',partidas[this.value].tiempoNegro);
                            localStorage.setItem('cantidadJugadores',partidas[this.value].cantidadJugadores);
                            localStorage.setItem('nombreJugadores',JSON.stringify(partidas[this.value].nombreJugadores));
                            cargarLocalStorage();
                        }, 200);
                    }
                    tabCell.appendChild(btn);
                }  else {
                    tabCell.innerHTML = valor;
                }
            }
        }
    
        var divContainer = document.getElementById("partidas_guardadas");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }
    cargarModales();
}


function guardarPartida() {
    if (partidas.length >= 7) {
        partidas.splice(0, 1);
    }
    partidas.push({
        fecha : formatDate(new Date()),
        imagen : canvas.toDataURL("image/png"),
        tablero: tablero,
        jugadorActual: jugadorActual == 3 ? 2 : (jugadorActual == 2 ? 1 : 3),
        tiempoRojo: tiempoRojo,
        tiempoAmarillo: tiempoAmarillo,
        tiempoNegro: tiempoNegro,
        cantidadJugadores: cantidadJugadores,
        nombreJugadores: nombreJugadores
    });
    localStorage.setItem('partidas', JSON.stringify(partidas));
    cargarPartidasGuardadas();
}

function ocultarMostrar3(jugadores) {
    var jugador3 = document.getElementById("jugador3");
    if (jugadores.value == 2) {
        jugador3.disabled = true;
    } else {
        jugador3.disabled = false;
    }
}

function guardarLocalStorage() {    
    localStorage.setItem('tablero', JSON.stringify(tablero));
    localStorage.setItem('jugadorActual', jugadorActual);
    localStorage.setItem('tiempoRojo', tiempoRojo);
    localStorage.setItem('tiempoAmarillo', tiempoAmarillo);
    localStorage.setItem('tiempoNegro', tiempoNegro);
    localStorage.setItem('cantidadJugadores', cantidadJugadores);
    localStorage.setItem('nombreJugadores', JSON.stringify(nombreJugadores));
}
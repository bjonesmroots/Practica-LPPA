var mensaje;
var empleadosLS;
window.onload = function () {
    mensaje = document.getElementById("message");
    mensaje.innerHTML = 'Cargando lista de empleados...';
    checkearLocalStorage();

    fetch('http://dummy.restapiexample.com/api/v1/employees')
    .then((response) => {
        if (response.status == 200) {
            response.json().then(function(empleados) {
                localStorage.setItem('empleados', JSON.stringify(empleados.data));
                armarTabla(empleados.data);
                mensaje.innerHTML = 'Lista de empleados';
            });
        }
    })
    .catch((error) => {        
        mensaje.innerText = 'Error al cargar la lista de empleados!';
        cargarDesdeLocalStorage();
    });
  
}

function checkearLocalStorage() {
    empleadosLS = localStorage.getItem('empleados');
    if (empleadosLS) {
        mensaje.innerText = 'Actualizando la lista de empleados!';
    }
}

function cargarDesdeLocalStorage() {
    if (empleadosLS) {
        armarTabla(JSON.parse(empleadosLS));
        mensaje.innerText = 'Error al cargar la lista de empleados! Mostrando lista cacheada';
    }
}

function armarTabla(empleados) {
    var col = [];
    col.push(['ID','id']);
    col.push(['Nombre','employee_name']);
    col.push(['Salario','employee_salary']);
    col.push(['Edad','employee_age']);
  
    var table = document.createElement("table");
  
    var tr = table.insertRow(-1);
  
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i][0];
        tr.appendChild(th);
    }
  
    for (var i = 0; i < empleados.length; i++) {  
        tr = table.insertRow(-1);  
        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            tabCell.innerHTML = empleados[i][col[j][1]];
        }
    }
  
    var divContainer = document.getElementById("data");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}
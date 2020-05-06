function borrar() {
    document.getElementById("resultado").value = "0";
    document.getElementById("memoria").value = "0";
}

function escribir(val) {
    var str1=document.getElementById('resultado').value; 
    if(str1 == '0') {
        if (val == '.') {
            document.getElementById('resultado').value = '0' + val
        } else {
            document.getElementById('resultado').value = val
        }
    }
    else { 
        var str2=val; 
        var res = str1.concat(str2);
        document.getElementById('resultado').value = res;
    }
}

function operaciones(oper)
{
    if (oper != '=') {
        if (document.getElementById("resultado").value.indexOf('*') != -1 
        || document.getElementById("resultado").value.indexOf('+') != -1
        || document.getElementById("resultado").value.indexOf('-') != -1
        || document.getElementById("resultado").value.indexOf('/') != -1) {
            calcular();
        }
        var operando1 = document.getElementById("resultado").value;
        document.getElementById("resultado").value = operando1 + oper;
        document.getElementById("memoria").value = oper;
    } else {
        calcular();
    }
}

function calcular() {
    operacion = document.getElementById("resultado").value;			
    var memoriaop = document.getElementById("memoria").value;    
    var operandos = operacion.split(memoriaop);    
    switch(memoriaop) {
        case '+':
            var resultado = sumarNumeros(operandos[0], operandos[1]);
            break;
        case '-':
            var resultado = restarNumeros(operandos[0], operandos[1]);
            break;
        case '*':
            var resultado = multiplicarNumeros(operandos[0], operandos[1]);
            break;
        case '/':
            var resultado = dividirNumeros(operandos[0], operandos[1]);
            break;        
    }	
    document.getElementById("resultado").value = resultado;
}

function sumarNumeros(n1, n2) {
    return (parseFloat(n1) + parseFloat(n2));
}

function restarNumeros(n1, n2) {
    return (parseFloat(n1) - parseFloat(n2));
}

function multiplicarNumeros(n1, n2) {
    return (parseFloat(n1) * parseFloat(n2));
}

function dividirNumeros(n1, n2) {
    return (parseFloat(n1) / parseFloat(n2));
}
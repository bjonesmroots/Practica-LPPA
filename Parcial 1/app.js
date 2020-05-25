window.onload = function () {
  var form = this.document.getElementById("form");
  form.onsubmit = function(event) {
    event.preventDefault();
    console.log(form.elements["nombre"].value);
    console.log(form.elements["apellido"].value);
    console.log(form.elements["email"].value);
    console.log(form.elements["edad"].value);
    console.log(form.elements["sexo"].value);
    var intereses =  document.getElementsByName("intereses[]");
    for(i = 0; i < intereses.length; i++)
    {
      console.log(intereses[i].value + ': ' + intereses[i].checked);
    } 
    console.log(form.elements["pais"].value);
    console.log(form.elements["comentario"].value);
  }
  
}

function validateform() {
  var form = this.document.getElementById("form");
  for (var i = 0; i < form.elements.length; i++) {
    if (!form.elements[i].validity.valid) {
      console.log('Campo ' + form.elements[i].name + ' invalido: ' + form.elements[i].validationMessage);
    }
  }
}
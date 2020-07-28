window.onload = function () {
    var form = this.document.getElementById("form");
    form.onsubmit = function(event) {
      event.preventDefault();
      var body = 'Nombre: ' + form.elements["nombre"].value + '%0D%0A';
      body +=  'Email: ' + form.elements["email"].value + '%0D%0A';
      body +=  'Mensaje: ' + form.elements["mensaje"].value;
      window.location.href = "mailto:bjones@mroots.com.ar?subject=Contacto desde 4 en linea&body=" + body;
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
// ===== BOTÓN VOLVER UNIVERSAL (FUNCIONA EN TODOS LOS NAVEGADORES) =====
document.addEventListener("DOMContentLoaded", function () {

    const btnVolver = document.getElementById("btnVolver");

    btnVolver.addEventListener("click", function () {

        // Si el usuario viene de otra página
        if (document.referrer && document.referrer !== "") {
            window.history.back();
        } 
        // Si entró directo al formulario
        else {
            window.location.href = "index.html"; // CAMBIA SI TU INICIO TIENE OTRO NOMBRE
        }

    });

    // ===== SOLO NÚMEROS EN TELÉFONO =====
    const telefono = document.getElementById("telefono");
    telefono.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "");
    });

    // ===== VALIDACIÓN DEL FORMULARIO =====
    const formulario = document.getElementById("formulario");
    formulario.addEventListener("submit", function(e){
        e.preventDefault();

        const correo = document.getElementById("correo").value;
        const mensaje = document.getElementById("mensaje");

        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!regexCorreo.test(correo)){
            mensaje.textContent = "Ingrese un correo válido (ej: usuario@gmail.com)";
            mensaje.style.color = "red";
            return;
        }

        mensaje.textContent = "Formulario enviado correctamente ✔";
        mensaje.style.color = "#1fd4d4";
    });

});

document.getElementById("btnVolver").addEventListener("click", function() {
    window.history.back();
});

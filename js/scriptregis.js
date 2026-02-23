function volver(){
    window.history.back();
}

function enviarFormulario(e){
    e.preventDefault();
    alert("Formulario enviado correctamente ✅");
}

// Función para volver
function volver(){
    window.history.back();
}

// Validación de solo números para cédula y teléfono
const numeroIdInput = document.getElementById("numeroId");
const telefonoInput = document.getElementById("telefono");

numeroIdInput.addEventListener("input", () => {
    numeroIdInput.value = numeroIdInput.value.replace(/\D/g, "");
});

telefonoInput.addEventListener("input", () => {
    telefonoInput.value = telefonoInput.value.replace(/\D/g, "");
});

// Función para enviar formulario
function enviarFormulario(e){
    e.preventDefault();

    const numeroId = numeroIdInput.value.trim();
    const telefono = telefonoInput.value.trim();

    // Validación de números
    if(numeroId === "" || !/^\d+$/.test(numeroId)){
        alert("Por favor ingrese un número de cédula válido (solo números).");
        return;
    }

    if(telefono === "" || !/^\d+$/.test(telefono)){
        alert("Por favor ingrese un número de teléfono válido (solo números).");
        return;
    }

    // Si todo está bien
    alert("Formulario enviado correctamente ✅");

    // Obtener los datos (opcional)
    const form = document.getElementById("registroForm");
    const formData = new FormData(form);
    const datos = {
        rol: formData.get("rol"),
        tipoId: formData.get("tipoId"),
        numeroId: numeroId,
        codigoPais: formData.get("codigoPais"),
        telefono: telefono,
        email: formData.get("email")
    };

    console.log("Formulario enviado:", datos);

    // Aquí puedes hacer fetch() o AJAX para enviar los datos al servidor
}

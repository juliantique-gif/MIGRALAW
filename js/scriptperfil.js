/* =========================================
   ESTADO DEL TRÁMITE (SIMULACIÓN)
   ESTE VALOR DEBE VENIR DE TU BASE DE DATOS
========================================= */

// Ejemplo: el usuario va en "Validación de documentos"
let estadoProceso = 3;


/* =========================================
   FUNCIÓN PARA ACTUALIZAR EL PROGRESO
========================================= */
function actualizarProgreso(estado) {

    // Total de pasos
    const totalPasos = 5;

    // Limpiar todos los pasos primero
    for (let i = 1; i <= totalPasos; i++) {
        const paso = document.getElementById("paso" + i);
        paso.classList.remove("completado");
    }

    // Activar los pasos según el estado del usuario
    for (let i = 1; i <= estado; i++) {
        const paso = document.getElementById("paso" + i);
        paso.classList.add("completado");
    }

    // Calcular avance de la línea verde
    let porcentaje = 0;

    if (estado > 1) {
        porcentaje = ((estado - 1) / (totalPasos - 1)) * 100;
    }

    // Actualizar la barra de progreso
    document.getElementById("lineaVerde").style.width = porcentaje + "%";
}


/* =========================================
   EJECUTAR AUTOMÁTICAMENTE AL CARGAR
========================================= */
document.addEventList

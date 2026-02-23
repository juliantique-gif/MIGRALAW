function toggleVisados(){
    const submenu = document.getElementById("submenuVisados");
    submenu.style.display = submenu.style.display === "block" ? "none" : "block";
}

function mostrarEstudios(){
    location.reload();
}

function limpiarContenido(){
    document.getElementById("contenido").innerHTML = "";
}

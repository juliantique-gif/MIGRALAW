// Manejo del menú lateral
function toggleVisados(){
    const submenu = document.getElementById("submenuVisados");
    // Verificamos si el display actual es block para alternar
    if (submenu.style.display === "block") {
        submenu.style.display = "none";
    } else {
        submenu.style.display = "block";
    }
}

// Función para recargar la vista de estudios
function mostrarEstudios(){
    location.reload();
}

// Función para limpiar el contenido principal y mostrar un mensaje de carga
function limpiarContenido(){
    const contenido = document.getElementById("contenido");
    if(contenido) {
        contenido.innerHTML = "<h2>Contenido en actualización</h2><p>Estamos trabajando para mostrarte la información de esta categoría pronto.</p>";
    }
}

// Lógica del Chatbot
document.addEventListener("DOMContentLoaded", () => {
    const fab = document.getElementById("chatbotFab");
    const windowChat = document.getElementById("chatbotWindow");
    const closeBtn = document.getElementById("chatbotClose");
    const form = document.getElementById("chatbotForm");
    const body = document.getElementById("chatbotBody");
    const input = document.getElementById("chatbotInput");

    // Abrir y cerrar ventana
    if(fab && windowChat && closeBtn) {
        fab.addEventListener("click", () => {
            windowChat.hidden = !windowChat.hidden;
        });

        closeBtn.addEventListener("click", () => {
            windowChat.hidden = true;
        });
    }

    // Enviar mensajes en el chat
    if(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const mensaje = input.value.trim();
            if(mensaje !== "") {
                const userMsg = document.createElement("div");
                userMsg.className = "msg msg-user";
                userMsg.style.alignSelf = "flex-end";
                userMsg.style.backgroundColor = "#e1f5fe";
                userMsg.textContent = mensaje;
                body.appendChild(userMsg);
                input.value = "";
                body.scrollTop = body.scrollHeight;
            }
        });
    }
});
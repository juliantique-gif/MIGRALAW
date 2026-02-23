const hamburguesa = document.querySelector(".hamburguesa");
const menu = document.querySelector("nav");

hamburguesa.addEventListener("click", () => {
    menu.classList.toggle("activo-menu");
});

// IDIOMA
const idioma = document.querySelector(".idioma");
const langText = document.getElementById("lang-text");
const opciones = document.querySelectorAll(".idioma-menu div");

idioma.addEventListener("click", () => {
    idioma.classList.toggle("activo");
});

opciones.forEach(opcion => {
    opcion.addEventListener("click", (e) => {
        const idiomaSeleccionado = e.target.dataset.lang;

        if(idiomaSeleccionado === "es"){
            langText.textContent = "ES";
        } else {
            langText.textContent = "EN";
        }

        idioma.classList.remove("activo");
    });
});
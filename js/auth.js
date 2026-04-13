// ==============================
// LÓGICA DE INICIO DE SESIÓN
// ==============================

function iniciarSesion() {
    // 1. Limpiar mensaje de error general
    const mensajeError = document.getElementById("mensajeError");
    mensajeError.style.display = "none";

    // 2. Validar campos obligatorios
    let esValido = true;

    if (!validarCampo("tipoId", "errorTipoId", "Seleccione un tipo")) esValido = false;
    if (!validarCampo("numId", "errorNumId", "Ingrese su número")) esValido = false;
    if (!validarCampo("password", "errorPassword", "Ingrese su contraseña")) esValido = false;

    if (!esValido) return;

    // 3. Obtener valores
    const tipoId = document.getElementById("tipoId").value;
    const numId = document.getElementById("numId").value.trim();
    const password = document.getElementById("password").value;

    // 4. Obtener usuarios desde localStorage
    const usuarios = obtenerUsuarios();

    // 5. Buscar usuario
    const usuario = usuarios.find(
        (u) => u.tipoId === tipoId && u.numId === numId && u.password === password
    );

    // 6. Validar resultado
    if (usuario) {
        // Guardar sesión
        sessionStorage.setItem("acmebank_sesion", usuario.numId);

        // Redirigir
        window.location.href = "dashboard.html";
    } else {
        mostrarAlerta(
            "mensajeError",
            "No se pudo validar su identidad. Verifique sus datos e intente nuevamente.",
            "error"
        );
    }
}


// ==============================
// VALIDACIÓN EN TIEMPO REAL
// ==============================

// NUMERO DE IDENTIFICACIÓN
document.getElementById("numId").addEventListener("input", function () {
    const tipoId = document.getElementById("tipoId").value;

    // Solo números si NO es pasaporte
    if (tipoId !== "PP") {
        this.value = this.value.replace(/\D/g, "");
    }

    if (this.value.trim() !== "") {
        document.getElementById("errorNumId").textContent = "";
        this.classList.remove("input-error");
    }
});

// CONTRASEÑA
document.getElementById("password").addEventListener("input", function () {
    if (this.value !== "") {
        document.getElementById("errorPassword").textContent = "";
        this.classList.remove("input-error");
    }
});


// ==============================
// CAMBIO DE TIPO DE DOCUMENTO
// ==============================

document.getElementById("tipoId").addEventListener("change", function () {
    const input = document.getElementById("numId");

    // Si cambia a un tipo que NO es pasaporte → limpiar letras
    if (this.value !== "PP") {
        input.value = input.value.replace(/\D/g, "");
    }
});


// ==============================
// ENVIAR CON ENTER
// ==============================

document.getElementById("password").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        iniciarSesion();
    }
});
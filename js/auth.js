function iniciarSesion() {
    const mensajeError = document.getElementById("mensajeError");
    mensajeError.style.display = "none";

    let esValido = true;
    if (!validarCampo("tipoId", "errorTipoId", "Seleccione un tipo")) esValido = false;
    if (!validarCampo("numId", "errorNumId", "Ingrese su número")) esValido = false;
    if (!validarCampo("password", "errorPassword", "Ingrese su contraseña")) esValido = false;

    if (!esValido) return;

    const tipoId = document.getElementById("tipoId").value;
    const numId = document.getElementById("numId").value.trim();
    const password = document.getElementById("password").value;

    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(
        (u) => u.tipoId === tipoId && u.numId === numId && u.password === password
    );

    if (usuario) {
        sessionStorage.setItem("acmebank_sesion", usuario.numId);
        window.location.href = "dashboard.html";
    } else {
        mostrarAlerta(
            "mensajeError",
            "No se pudo validar su identidad. Verifique sus datos e intente nuevamente.",
            "error"
        );
    }
}

// Solo números si NO es pasaporte
document.getElementById("numId").addEventListener("input", function () {
    const tipoId = document.getElementById("tipoId").value;
    if (tipoId !== "PP") {
        this.value = this.value.replace(/\D/g, "");
    }
    if (this.value.trim() !== "") {
        document.getElementById("errorNumId").textContent = "";
        this.classList.remove("input-error");
    }
});

document.getElementById("password").addEventListener("input", function () {
    if (this.value !== "") {
        document.getElementById("errorPassword").textContent = "";
        this.classList.remove("input-error");
    }
});

document.getElementById("tipoId").addEventListener("change", function () {
    const input = document.getElementById("numId");
    if (this.value !== "PP") {
        input.value = input.value.replace(/\D/g, "");
    }
});

// Enviar con Enter desde el campo de contraseña
document.getElementById("password").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        iniciarSesion();
    }
});

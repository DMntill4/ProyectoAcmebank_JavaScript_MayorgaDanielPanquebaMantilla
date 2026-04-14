let usuarioVerificado = null;

function verificarIdentidad() {
    document.getElementById("mensajeVerificar").style.display = "none";

    let esValido = true;
    if (!validarCampo("recTipoId", "errRecTipoId", "Seleccione un tipo de identificación")) esValido = false;
    if (!validarCampo("recNumId", "errRecNumId", "Ingrese su número de identificación")) esValido = false;
    if (!validarCampo("recEmail", "errRecEmail", "Ingrese su correo electrónico")) esValido = false;

    if (!esValido) return;

    const tipoId = document.getElementById("recTipoId").value;
    const numId = document.getElementById("recNumId").value.trim();
    const email = document.getElementById("recEmail").value.trim();

    if (!validarEmail(email)) {
        document.getElementById("errRecEmail").textContent = "Ingrese un correo electrónico válido";
        document.getElementById("recEmail").classList.add("input-error");
        return;
    }

    const usuarios = obtenerUsuarios();
    const usuarioEncontrado = usuarios.find(function(u) {
        return u.tipoId === tipoId &&
               u.numId === numId &&
               u.email.toLowerCase() === email.toLowerCase();
    });

    if (!usuarioEncontrado) {
        mostrarAlerta("mensajeVerificar", "No encontramos una cuenta con esa información.", "error");
        return;
    }

    usuarioVerificado = usuarioEncontrado;
    document.getElementById("formVerificar").style.display = "none";
    document.getElementById("formNuevaPass").style.display = "block";
}

function cambiarContrasena() {
    if (!usuarioVerificado) {
        window.location.href = "recuperar.html";
        return;
    }

    let esValido = true;
    if (!validarCampo("nuevaPass", "errNuevaPass", "Ingrese su nueva contraseña")) esValido = false;
    if (!validarCampo("confirmarNuevaPass", "errConfirmarNuevaPass", "Confirme su contraseña")) esValido = false;

    if (!esValido) return;

    const nuevaPass = document.getElementById("nuevaPass").value;
    const confirmarPass = document.getElementById("confirmarNuevaPass").value;

    if (!validarFormatoPassword(nuevaPass)) {
        document.getElementById("errNuevaPass").textContent = "Mínimo 8 caracteres";
        document.getElementById("nuevaPass").classList.add("input-error");
        return;
    }

    if (nuevaPass !== confirmarPass) {
        document.getElementById("errConfirmarNuevaPass").textContent = "Las contraseñas no coinciden";
        document.getElementById("confirmarNuevaPass").classList.add("input-error");
        return;
    }

    // Se necesita el array completo para poder modificarlo y guardarlo de vuelta
    const usuarios = obtenerUsuarios();
    const indice = usuarios.findIndex(function(u) {
        return u.tipoId === usuarioVerificado.tipoId &&
               u.numId === usuarioVerificado.numId;
    });

    if (indice === -1) {
        mostrarAlerta("mensajeCambio", "Error inesperado", "error");
        return;
    }

    usuarios[indice].password = nuevaPass;
    guardarUsuarios(usuarios);

    mostrarAlerta("mensajeCambio", "Contraseña actualizada correctamente. Redirigiendo...", "success");
    usuarioVerificado = null;

    setTimeout(function() {
        window.location.href = "index.html";
    }, 2500);
}

document.addEventListener("DOMContentLoaded", function () {
    const camposVerificar = document.querySelectorAll("#formVerificar input, #formVerificar select");

    camposVerificar.forEach(function(campo) {
        campo.addEventListener("input", function () {
            if (this.id === "recNumId") {
                const tipoId = document.getElementById("recTipoId").value;
                if (tipoId !== "PP") {
                    this.value = this.value.replace(/\D/g, "");
                }
            }
            const errorSpan = this.parentElement.querySelector(".error-msg");
            if (errorSpan) errorSpan.textContent = "";
            this.classList.remove("input-error");
        });
    });

    document.getElementById("recTipoId").addEventListener("change", function () {
        const input = document.getElementById("recNumId");
        if (this.value !== "PP") {
            input.value = input.value.replace(/\D/g, "");
        }
    });

    const camposPass = document.querySelectorAll("#formNuevaPass input");
    camposPass.forEach(function(campo) {
        campo.addEventListener("input", function () {
            const errorSpan = this.parentElement.querySelector(".error-msg");
            if (errorSpan) errorSpan.textContent = "";
            this.classList.remove("input-error");
        });
    });
});

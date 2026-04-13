// ==============================
// LÓGICA DE RECUPERACIÓN DE CONTRASEÑA
// ==============================

// Usuario verificado entre pasos
let usuarioVerificado = null;


// ==============================
// PASO 1: VERIFICAR IDENTIDAD
// ==============================

function verificarIdentidad() {
    document.getElementById("mensajeVerificar").style.display = "none";

    let esValido = true;

    if (!validarCampo("recTipoId", "errRecTipoId", "Seleccione un tipo de identificación")) esValido = false;
    if (!validarCampo("recNumId", "errRecNumId", "Ingrese su número de identificación")) esValido = false;
    if (!validarCampo("recEmail", "errRecEmail", "Ingrese su correo electrónico")) esValido = false;

    if (!esValido) return;

    const tipoId = document.getElementById("recTipoId").value;
    const numId = document.getElementById("recNumId").value.trim();
    const email = document.getElementById("recEmail").value.trim().toLowerCase();

    // Validar email
    if (!validarEmail(email)) {
        document.getElementById("errRecEmail").textContent = "Ingrese un correo electrónico válido";
        document.getElementById("recEmail").classList.add("input-error");
        return;
    }

    const usuarios = obtenerUsuarios();

    const usuarioEncontrado = usuarios.find((u) =>
        u.tipoId === tipoId &&
        u.numId === numId &&
        u.email.toLowerCase() === email
    );

    if (!usuarioEncontrado) {
        mostrarAlerta(
            "mensajeVerificar",
            "No encontramos una cuenta con esa información.",
            "error"
        );
        return;
    }

    // Guardar usuario
    usuarioVerificado = usuarioEncontrado;

    // Cambiar vista
    document.getElementById("formVerificar").style.display = "none";
    document.getElementById("formNuevaPass").style.display = "block";
}


// ==============================
// PASO 2: CAMBIAR CONTRASEÑA
// ==============================

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

    const usuarios = obtenerUsuarios();

    const indice = usuarios.findIndex((u) =>
        u.tipoId === usuarioVerificado.tipoId &&
        u.numId === usuarioVerificado.numId
    );

    if (indice === -1) {
        mostrarAlerta("mensajeCambio", "Error inesperado", "error");
        return;
    }

    // Actualizar contraseña
    usuarios[indice].password = nuevaPass;
    guardarUsuarios(usuarios);

    mostrarAlerta(
        "mensajeCambio",
        "Contraseña actualizada correctamente. Redirigiendo...",
        "success"
    );

    usuarioVerificado = null;

    setTimeout(() => {
        window.location.href = "index.html";
    }, 2500);
}


// ==============================
// VALIDACIÓN EN TIEMPO REAL
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // CAMPOS DEL PASO 1
    const camposVerificar = document.querySelectorAll("#formVerificar input, #formVerificar select");

    camposVerificar.forEach((campo) => {
        campo.addEventListener("input", function () {

            // Validación tipo documento
            if (this.id === "recNumId") {
                const tipoId = document.getElementById("recTipoId").value;

                if (tipoId !== "PP") {
                    this.value = this.value.replace(/\D/g, "");
                }
                // PP → permite letras y números
            }

            // Limpiar errores
            const errorSpan = this.parentElement.querySelector(".error-msg");
            if (errorSpan) errorSpan.textContent = "";

            this.classList.remove("input-error");
        });
    });


    // LIMPIAR CUANDO CAMBIA TIPO DE DOCUMENTO
    document.getElementById("recTipoId").addEventListener("change", function () {
        const input = document.getElementById("recNumId");

        if (this.value !== "PP") {
            input.value = input.value.replace(/\D/g, "");
        }
    });


    // CAMPOS DEL PASO 2
    const camposPass = document.querySelectorAll("#formNuevaPass input");

    camposPass.forEach((campo) => {
        campo.addEventListener("input", function () {
            const errorSpan = this.parentElement.querySelector(".error-msg");
            if (errorSpan) errorSpan.textContent = "";

            this.classList.remove("input-error");
        });
    });

});
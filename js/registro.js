function registrarUsuario() {
    let esValido = true;

    if (!validarCampo("regTipoId", "errRegTipoId", "Seleccione un tipo")) esValido = false;
    if (!validarCampo("regNumId", "errRegNumId", "Campo obligatorio")) esValido = false;
    if (!validarCampo("regNombres", "errRegNombres", "Campo obligatorio")) esValido = false;
    if (!validarCampo("regApellidos", "errRegApellidos", "Campo obligatorio")) esValido = false;
    if (!validarCampo("regGenero", "errRegGenero", "Seleccione una opción")) esValido = false;
    if (!validarCampo("regTelefono", "errRegTelefono", "Campo obligatorio")) esValido = false;
    if (!validarCampo("regEmail", "errRegEmail", "Campo obligatorio")) esValido = false;
    if (!validarCampo("regDireccion", "errRegDireccion", "Campo obligatorio")) esValido = false;
    if (!validarCampo("regCiudad", "errRegCiudad", "Campo obligatorio")) esValido = false;
    if (!validarCampo("regPassword", "errRegPassword", "Campo obligatorio")) esValido = false;
    if (!validarCampo("regPasswordConfirm", "errRegPasswordConfirm", "Campo obligatorio")) esValido = false;

    const regexSoloNumeros = /^[0-9]+$/;
    const tipoIdParaValidar = document.getElementById("regTipoId").value;
    const regNumIdValue = document.getElementById("regNumId").value;

    // Solo números para CC, TI, CE — el pasaporte permite letras y números
    if (regNumIdValue && tipoIdParaValidar !== "PP" && !regexSoloNumeros.test(regNumIdValue)) {
        document.getElementById("errRegNumId").textContent = "Solo se permiten números para este tipo de ID";
        esValido = false;
    }

    const regTelefonoValue = document.getElementById("regTelefono").value;
    if (regTelefonoValue && !regexSoloNumeros.test(regTelefonoValue)) {
        document.getElementById("errRegTelefono").textContent = "Solo se permiten números";
        esValido = false;
    }

    const email = document.getElementById("regEmail").value.trim();
    if (email && !validarEmail(email)) {
        document.getElementById("errRegEmail").textContent = "Email no válido";
        document.getElementById("regEmail").classList.add("input-error");
        esValido = false;
    }

    const password = document.getElementById("regPassword").value;
    if (password && !validarFormatoPassword(password)) {
        document.getElementById("errRegPassword").textContent = "Mínimo 8 caracteres";
        document.getElementById("regPassword").classList.add("input-error");
        esValido = false;
    }

    const passwordConfirm = document.getElementById("regPasswordConfirm").value;
    if (password && passwordConfirm && password !== passwordConfirm) {
        document.getElementById("errRegPasswordConfirm").textContent = "Las contraseñas no coinciden";
        document.getElementById("regPasswordConfirm").classList.add("input-error");
        esValido = false;
    }

    if (!esValido) return;

    const numId = document.getElementById("regNumId").value.trim();
    const tipoId = document.getElementById("regTipoId").value;
    const usuarios = obtenerUsuarios();

    // Verificar que el usuario no exista ya
    const existe = usuarios.some(function(u) { return u.tipoId === tipoId && u.numId === numId; });
    if (existe) {
        mostrarAlerta("mensajeRegistro", "Ya existe una cuenta con esa identificación.", "error");
        return;
    }

    const nuevoUsuario = {
        tipoId: tipoId,
        numId: numId,
        nombres: document.getElementById("regNombres").value.trim(),
        apellidos: document.getElementById("regApellidos").value.trim(),
        genero: document.getElementById("regGenero").value,
        telefono: document.getElementById("regTelefono").value.trim(),
        email: email,
        direccion: document.getElementById("regDireccion").value.trim(),
        ciudad: document.getElementById("regCiudad").value.trim(),
        password: password,
        numeroCuenta: generarNumeroCuenta(),
        fechaCreacion: new Date().toISOString(),
        saldo: 0,
        transacciones: [],
    };

    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    document.getElementById("registroForm").style.display = "none";
    document.getElementById("resumenRegistro").style.display = "block";

    const tiposId = { CC: "Cédula de Ciudadanía", TI: "Tarjeta de Identidad", CE: "Cédula de Extranjería", PP: "Pasaporte" };
    document.getElementById("resNumeroCuenta").textContent = nuevoUsuario.numeroCuenta;
    document.getElementById("resTitular").textContent = `${nuevoUsuario.nombres} ${nuevoUsuario.apellidos}`;
    document.getElementById("resTipoId").textContent = tiposId[nuevoUsuario.tipoId];
    document.getElementById("resNumId").textContent = nuevoUsuario.numId;
    document.getElementById("resFechaCreacion").textContent = formatearFecha(nuevoUsuario.fechaCreacion);
}

// Validación en tiempo real
const camposRegistro = document.querySelectorAll("#registroForm input, #registroForm select");
camposRegistro.forEach(function(campo) {
    campo.addEventListener("input", function () {
        if (this.id === "regNumId") {
            const tipoIdActual = document.getElementById("regTipoId").value;
            if (tipoIdActual !== "PP") {
                this.value = this.value.replace(/\D/g, "");
            }
        }

        if (this.id === "regTelefono") {
            this.value = this.value.replace(/\D/g, "");
        }

        const errorSpan = this.parentElement.querySelector(".error-msg") || this.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains("error-msg")) {
            errorSpan.textContent = "";
        }
        this.classList.remove("input-error");
    });
});

// Listener separado para que no se apile dentro del forEach de arriba
document.getElementById("regTipoId").addEventListener("change", function () {
    const input = document.getElementById("regNumId");
    if (this.value !== "PP") {
        input.value = input.value.replace(/\D/g, "");
    }
});

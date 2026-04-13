// ==============================
// LÓGICA DE REGISTRO DE USUARIO
// ==============================

function registrarUsuario() {
    // 1. Validar TODOS los campos (son obligatorios según los requerimientos)
    let esValido = true;

    // Cada validarCampo verifica si el campo está vacío
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

    // 2. Validaciones específicas

    const regexSoloNumeros = /^[0-9]+$/;
    const tipoIdParaValidar = document.getElementById("regTipoId").value;

    const regNumIdValue = document.getElementById("regNumId").value;
    if (regNumIdValue && !regexSoloNumeros.test(regNumIdValue)) {
        document.getElementById("errRegNumId").textContent = "Solo se permiten números";
        esValido = false;
    }

    if (regNumIdValue) {
    // Solo marcamos error si NO es Pasaporte y detectamos letras
    if (tipoIdParaValidar !== "PP" && !regexSoloNumeros.test(regNumIdValue)) {
        document.getElementById("errRegNumId").textContent = "Solo se permiten números para este tipo de ID";
        esValido = false;
    }
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

    // 3. Verificar que el usuario no exista ya
    const numId = document.getElementById("regNumId").value.trim();
    const tipoId = document.getElementById("regTipoId").value;
    const usuarios = obtenerUsuarios();

    // some() verifica si ALGÚN elemento cumple la condición
    const existe = usuarios.some((u) => u.tipoId === tipoId && u.numId === numId);

    if (existe) {
        mostrarAlerta("mensajeRegistro", "Ya existe una cuenta con esa identificación.", "error");
        return;
    }

    // 4. Crear el objeto del nuevo usuario
    // Este es el "modelo" de datos que guardaremos en localStorage
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
        // El número de cuenta y la fecha se generan automáticamente
        numeroCuenta: generarNumeroCuenta(),
        fechaCreacion: new Date().toISOString(), // Fecha actual en formato ISO
        saldo: 0, // Empieza con saldo 0
        transacciones: [], // Array vacío para las futuras transacciones
    };

    // 5. Agregar al array de usuarios y guardar
    // push() agrega un elemento al final del array
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    // 6. Mostrar resumen de registro exitoso
    document.getElementById("registroForm").style.display = "none";
    document.getElementById("resumenRegistro").style.display = "block";

    // Llenar el resumen con los datos del nuevo usuario
    const tiposId = { CC: "Cédula de Ciudadanía", TI: "Tarjeta de Identidad", CE: "Cédula de Extranjería", PP: "Pasaporte" };
    document.getElementById("resNumeroCuenta").textContent = nuevoUsuario.numeroCuenta;
    document.getElementById("resTitular").textContent = `${nuevoUsuario.nombres} ${nuevoUsuario.apellidos}`;
    document.getElementById("resTipoId").textContent = tiposId[nuevoUsuario.tipoId];
    document.getElementById("resNumId").textContent = nuevoUsuario.numId;
    document.getElementById("resFechaCreacion").textContent = formatearFecha(nuevoUsuario.fechaCreacion);
}




// --- VALIDACIÓN EN TIEMPO REAL ---
// Recorremos todos los inputs del formulario y agregamos listeners
const camposRegistro = document.querySelectorAll("#registroForm input, #registroForm select");
camposRegistro.forEach((campo) => {
    campo.addEventListener("input", function () {

        
            if (this.id === "regNumId") {
            const tipoIdActual = document.getElementById("regTipoId").value;

            if (tipoIdActual !== "PP") {
                // Solo números para cédula, TI, etc.
                this.value = this.value.replace(/\D/g, "");
            }
            // Si es PP → permite letras y números
        }

        if (this.id === "regTelefono") {
            // Teléfono SIEMPRE números
            this.value = this.value.replace(/\D/g, "");
        }

        // Limpiar errores
        const errorSpan = this.parentElement.querySelector(".error-msg") ||
            this.nextElementSibling;

        if (errorSpan && errorSpan.classList.contains("error-msg")) {
            errorSpan.textContent = "";
        }

        this.classList.remove("input-error");

        document.getElementById("regTipoId").addEventListener("change", function () {
        const input = document.getElementById("regNumId");

        if (this.value !== "PP") {
            input.value = input.value.replace(/\D/g, "");
        }
        });
    });
});
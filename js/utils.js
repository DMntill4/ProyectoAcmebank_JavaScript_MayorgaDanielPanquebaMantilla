// ==============================
// UTILIDADES COMPARTIDAS
// Estas funciones se usan en todas las páginas
// ==============================

// --- FORMATEAR MONEDA ---
// Recibe un número y lo muestra como dinero colombiano
// Ejemplo: formatearMoneda(50000) => "$ 50.000"
function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0,
    }).format(valor);
}

// --- FORMATEAR FECHA ---
// Convierte un string de fecha a formato legible
// Ejemplo: formatearFecha("2025-04-09T10:30:00") => "9 de abril de 2025, 10:30 a.m."
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

// --- FORMATEAR SOLO FECHA (sin hora) ---
function formatearSoloFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

// --- GENERAR NÚMERO DE CUENTA ---
// Crea un número de cuenta aleatorio de 10 dígitos
// Empieza con "40" (código del banco)
function generarNumeroCuenta() {
    const random = Math.floor(Math.random() * 100000000)
        .toString()
        .padStart(8, "0");
    return "40" + random;
}

// --- GENERAR NÚMERO DE REFERENCIA ---
// Crea un código de referencia para las transacciones
// Ejemplo: "REF-A3B7C2D1"
function generarReferencia() {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let referencia = "REF-";
    for (let i = 0; i < 8; i++) {
        const indice = Math.floor(Math.random() * caracteres.length);
        referencia += caracteres.charAt(indice);
    }
    return referencia;
}

// --- MOSTRAR/OCULTAR CONTRASEÑA ---
// Cambia el tipo del input entre "password" y "text"
// Usamos SVG en lugar de emojis para los íconos
function togglePassword(inputId, boton) {
    const input = document.getElementById(inputId);

    // SVG del ojo abierto (contraseña visible)
    const iconoVer = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94
        M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19
        m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>`;

    // SVG del ojo cerrado (contraseña oculta)
    const iconoOcultar = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>`;

    if (input.type === "password") {
        input.type = "text";
        boton.innerHTML = iconoVer;
    } else {
        input.type = "password";
        boton.innerHTML = iconoOcultar;
    }
}

// --- VALIDAR QUE UN CAMPO NO ESTÉ VACÍO ---
// Retorna true si tiene contenido, false si está vacío
// También muestra/oculta el mensaje de error
function validarCampo(inputId, errorId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);
    const valor = input.value.trim();

    if (valor === "") {
        error.textContent = mensaje;
        input.classList.add("input-error");
        return false;
    } else {
        error.textContent = "";
        input.classList.remove("input-error");
        return true;
    }
}

// --- VALIDAR EMAIL ---
// Usa una expresión regular para verificar el formato
// Verifica que tenga: texto@texto.texto
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// --- VALIDAR CONTRASEÑA ---
// Mínimo 8 caracteres
function validarFormatoPassword(password) {
    return password.length >= 8;
}

// --- OBTENER USUARIOS DE LOCALSTORAGE ---
function obtenerUsuarios() {
    const datos = localStorage.getItem("acmebank_usuarios");
    return datos ? JSON.parse(datos) : [];
}

// --- GUARDAR USUARIOS EN LOCALSTORAGE ---
// JSON.stringify convierte el array a texto para guardarlo
function guardarUsuarios(usuarios) {
    localStorage.setItem("acmebank_usuarios", JSON.stringify(usuarios));
}

// --- OBTENER USUARIO LOGUEADO ---
// Lee el ID guardado en sessionStorage y busca al usuario
function obtenerUsuarioActual() {
    const id = sessionStorage.getItem("acmebank_sesion");
    if (!id) return null;

    const usuarios = obtenerUsuarios();
    return usuarios.find((u) => u.numId === id) || null;
}

// --- MOSTRAR ALERTA ---
function mostrarAlerta(elementId, mensaje, tipo) {
    const el = document.getElementById(elementId);
    el.textContent = mensaje;
    el.className = `alert alert-${tipo}`;
    el.style.display = "block";
}

// --- IMPRIMIR UNA SECCIÓN ESPECÍFICA ---
// Abre una ventana nueva solo con el contenido a imprimir
function imprimirSeccion(seccionId) {
    const contenido = document.getElementById(seccionId).innerHTML;
    const ventana = window.open("", "_blank");
    ventana.document.write(`
        <html>
        <head>
            <title>Banco Acme - Impresión</title>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'DM Sans', sans-serif; padding: 40px; color: #1e293b; }
                h2, h3 { font-family: 'Outfit', sans-serif; }
                table { width: 100%; border-collapse: collapse; margin: 16px 0; }
                th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 0.9rem; }
                th { background: #f8fafc; font-weight: 600; color: #475569; }
                p { margin: 8px 0; }
                .valor-positivo { color: #16a34a; }
                .valor-negativo { color: #dc2626; }
                .logo-icon { display: inline-flex; width: 36px; height: 36px; background: #1a56db;
                    color: white; border-radius: 8px; align-items: center; justify-content: center; font-weight: 700; }
            </style>
        </head>
        <body>${contenido}</body>
        </html>
    `);
    ventana.document.close();
    // Esperamos un momento para que carguen las fuentes antes de imprimir
    setTimeout(() => ventana.print(), 500);
}

// ==============================
// TEMA CLARO / OSCURO
// Guardamos la preferencia en localStorage
// ==============================

// Inicializar el tema al cargar la página
// Esto lee la preferencia guardada y aplica la clase correspondiente
function inicializarTema() {
    const tema = localStorage.getItem("acmebank_tema") || "light";
    // Ponemos el atributo en el <html> para que el CSS lo detecte
    document.documentElement.setAttribute("data-theme", tema);
    actualizarBotonTema(tema);
}

// Cambiar entre claro y oscuro al hacer clic en el botón
function toggleTema() {
    const temaActual = document.documentElement.getAttribute("data-theme") || "light";
    const nuevoTema = temaActual === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nuevoTema);
    localStorage.setItem("acmebank_tema", nuevoTema);
    actualizarBotonTema(nuevoTema);
}

// Actualizar el ícono del botón según el tema
function actualizarBotonTema(tema) {
    const btn = document.getElementById("btnTema");
    if (!btn) return; // Si no hay botón en la página, salir

    // Ícono de luna (para poner modo oscuro)
    const iconoLuna = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>`;

    // Ícono de sol (para poner modo claro)
    const iconoSol = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>`;

    // Si estamos en modo oscuro, el botón muestra el sol (para ir a claro)
    // Si estamos en modo claro, el botón muestra la luna (para ir a oscuro)
    btn.innerHTML = tema === "dark" ? iconoSol : iconoLuna;
    btn.title = tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
}

// ==============================
// EXPORTAR DATOS A JSON
// Descarga un archivo .json con todos los usuarios
// ==============================
function exportarDatosJSON() {
    const usuarios = obtenerUsuarios();

    const datos = {
        exportado: new Date().toISOString(),
        version: "1.0",
        banco: "Banco Acme",
        usuarios: usuarios
    };

    // Convertimos el objeto a texto JSON con formato legible (null, 2 = con indentación)
    const json = JSON.stringify(datos, null, 2);

    // Creamos un "blob" (archivo en memoria) con el texto JSON
    const blob = new Blob([json], { type: "application/json" });

    // Creamos una URL temporal para el archivo
    const url = URL.createObjectURL(blob);

    // Creamos un enlace invisible y hacemos clic en él para descargar
    const enlace = document.createElement("a");
    enlace.href = url;
    // Nombre del archivo con la fecha de hoy
    enlace.download = `banco-acme-backup-${new Date().toISOString().slice(0, 10)}.json`;
    enlace.click();

    // Liberamos la URL temporal de la memoria
    URL.revokeObjectURL(url);
}

// ==============================
// IMPORTAR DATOS DESDE JSON
// Lee un archivo .json y mezcla los usuarios con los existentes
// Retorna una Promesa que resuelve con el número de usuarios importados
// ==============================
function importarDatosJSON(archivo) {
    // Una Promesa es una forma de manejar operaciones que tardan tiempo
    // (como leer un archivo). "resolve" = éxito, "reject" = error
    return new Promise(function(resolve, reject) {
        const lector = new FileReader(); // Herramienta para leer archivos

        // Esta función se ejecuta cuando el archivo termina de leerse
        lector.onload = function(evento) {
            try {
                const datos = JSON.parse(evento.target.result);

                // Verificamos que el archivo tenga el formato correcto
                if (!datos.usuarios || !Array.isArray(datos.usuarios)) {
                    reject("El archivo no tiene el formato correcto.");
                    return;
                }

                const usuariosActuales = obtenerUsuarios();
                let importados = 0;

                datos.usuarios.forEach(function(usuarioImportado) {
                    // Solo importar si no existe ya un usuario con ese tipo e ID
                    const yaExiste = usuariosActuales.some(function(u) {
                        return u.tipoId === usuarioImportado.tipoId && u.numId === usuarioImportado.numId;
                    });

                    if (!yaExiste) {
                        usuariosActuales.push(usuarioImportado);
                        importados++;
                    }
                });

                guardarUsuarios(usuariosActuales);
                resolve(importados);

            } catch (error) {
                reject("Error al leer el archivo. Verifique que sea un JSON válido.");
            }
        };

        lector.onerror = function() {
            reject("No se pudo abrir el archivo.");
        };

        lector.readAsText(archivo);
    });
}

// ==============================
// AUTO-INICIALIZAR TEMA
// Se ejecuta automáticamente cuando la página carga
// Evita que el usuario vea un "flash" del tema incorrecto
// ==============================
document.addEventListener("DOMContentLoaded", function() {
    inicializarTema();
});

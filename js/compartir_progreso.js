// =====================================================
// ACTUALIZAR DATOS DE LA TARJETA
// =====================================================

async function actualizarTarjetaCompartir() {

    try {

        const respuesta = await fetch(
            "../php/compartir_progreso.php"
        );

        const datos = await respuesta.json();

        if (datos.status !== "success") {

            console.error(
                "No se pudo obtener el progreso:",
                datos.message
            );

            return false;
        }

        const u = datos.usuario;

        const nombre =
            document.getElementById("shareNombre");

        const nivel =
            document.getElementById("shareNivel");

        const xp =
            document.getElementById("shareXP");

        const medallas =
            document.getElementById("shareMedallas");

        const examenes =
            document.getElementById("shareExamenes");

        const foto =
            document.getElementById("shareFoto");


        if (nombre) {
            nombre.textContent = u.nombre || "";
        }


        if (nivel) {
            nivel.textContent = u.nivel || "1";
        }


        if (xp) {
            xp.textContent = u.xp || "0";
        }


        if (medallas) {

            medallas.textContent =
                (u.medallas || 0) +
                "/" +
                (u.totalMedallas || 10);

        }


        if (examenes) {

            examenes.textContent =
                (u.examenes || 0) +
                "/" +
                (u.totalExamenes || 10);

        }


        if (foto && u.foto) {

            /*
             * Si PHP devuelve una ruta relativa,
             * convertirla a URL absoluta.
             */

            let rutaFoto = u.foto;

            if (
                rutaFoto.startsWith("../")
            ) {

                rutaFoto =
                    "/Castoresmlaulanet/" +
                    rutaFoto.replace(
                        "../",
                        ""
                    );

            }

            if (
                !rutaFoto.startsWith("http") &&
                !rutaFoto.startsWith("/")
            ) {

                rutaFoto =
                    "/Castoresmlaulanet/" +
                    rutaFoto;

            }

            foto.src = rutaFoto;

            foto.crossOrigin = "anonymous";

        }


        return true;

    } catch (error) {

        console.error(
            "Error actualizando tarjeta:",
            error
        );

        return false;
    }
}


// =====================================================
// ESPERAR A QUE LAS IMÁGENES CARGUEN
// =====================================================

function esperarImagen(img) {

    return new Promise(function(resolve) {

        if (!img) {

            resolve();

            return;
        }


        if (img.complete) {

            resolve();

            return;
        }


        img.onload = function() {
            resolve();
        };


        img.onerror = function() {

            console.warn(
                "No se pudo cargar:",
                img.src
            );

            resolve();

        };

    });

}


// =====================================================
// PREPARAR CLON
// =====================================================

function prepararTarjetaParaCanvas(documentoClonado) {

    const tarjetaClonada =
        documentoClonado.getElementById(
            "tarjetaExportar"
        );


    if (!tarjetaClonada) {

        console.warn(
            "No existe tarjetaExportar en el clon."
        );

        return;
    }


    /*
     * Eliminar gradientes.
     */

    const elementos =
        tarjetaClonada.querySelectorAll("*");


    elementos.forEach(function(elemento) {

        try {

            const estilo =
                documentoClonado.defaultView
                    .getComputedStyle(elemento);


            const fondo =
                estilo.backgroundImage;


            if (
                fondo &&
                fondo.includes("gradient")
            ) {

                elemento.style.backgroundImage =
                    "none";


                if (
                    estilo.backgroundColor &&
                    estilo.backgroundColor !==
                    "rgba(0, 0, 0, 0)"
                ) {

                    elemento.style.backgroundColor =
                        estilo.backgroundColor;

                }

            }


            /*
             * Eliminar sombras problemáticas.
             */

            elemento.style.boxShadow =
                "none";


            /*
             * Eliminar filtros.
             */

            elemento.style.filter =
                "none";


            elemento.style.backdropFilter =
                "none";


        } catch (error) {

            console.warn(
                "Error procesando elemento:",
                error
            );

        }

    });


    /*
     * Asegurar imágenes.
     */

    const imagenes =
        tarjetaClonada.querySelectorAll("img");


    imagenes.forEach(function(img) {

        img.crossOrigin =
            "anonymous";

    });

}


// =====================================================
// GENERAR CANVAS
// =====================================================

async function generarCanvasTarjeta() {

    const tarjetaOriginal =
        document.getElementById("tarjetaExportar");

    if (!tarjetaOriginal) {
        throw new Error(
            "No existe el elemento #tarjetaExportar."
        );
    }

    console.log("Preparando tarjeta para exportación...");

    /*
    =====================================================
    CREAR UNA COPIA INDEPENDIENTE
    =====================================================
    */

    const tarjeta =
        tarjetaOriginal.cloneNode(true);

    /*
    =====================================================
    QUITAR ID PARA EVITAR CONFLICTOS
    =====================================================
    */

    tarjeta.id = "tarjetaExportarCanvas";

    /*
    =====================================================
    CREAR CONTENEDOR FUERA DEL MODAL
    =====================================================
    */

    const contenedor =
        document.createElement("div");

    contenedor.id =
        "contenedorCanvasTemporal";

    contenedor.style.position =
        "fixed";

    contenedor.style.left =
        "-10000px";

    contenedor.style.top =
        "0";

    contenedor.style.width =
        "1080px";

    contenedor.style.height =
        "1350px";

    contenedor.style.display =
        "block";

    contenedor.style.visibility =
        "visible";

    contenedor.style.opacity =
        "1";

    contenedor.style.zIndex =
        "-9999";

    /*
    =====================================================
    CONFIGURAR TARJETA
    =====================================================
    */

    tarjeta.style.display =
        "flex";

    tarjeta.style.visibility =
        "visible";

    tarjeta.style.opacity =
        "1";

    tarjeta.style.width =
        "1080px";

    tarjeta.style.height =
        "1350px";

    tarjeta.style.position =
        "relative";

    tarjeta.style.margin =
        "0";

    tarjeta.style.transform =
        "none";

    /*
    =====================================================
    AGREGAR AL DOCUMENTO
    =====================================================
    */

    contenedor.appendChild(tarjeta);

    document.body.appendChild(contenedor);

    /*
    =====================================================
    ESPERAR A QUE EL NAVEGADOR LO RENDERICE
    =====================================================
    */

    await new Promise(function(resolve) {

        requestAnimationFrame(function() {

            requestAnimationFrame(resolve);

        });

    });

    /*
    =====================================================
    ESPERAR IMÁGENES
    =====================================================
    */

    const imagenes =
        tarjeta.querySelectorAll("img");
    imagenes.forEach(function(img) {

    const src =
        img.getAttribute("src");

    if (!src) {
        return;
    }

    /*
    Convertir ruta relativa a absoluta
    */

    try {

        img.src =
            new URL(
                src,
                window.location.href
            ).href;

    } catch(error) {

        console.warn(
            "No se pudo convertir la ruta:",
            src
        );

    }

});    

    await Promise.all(

        Array.from(imagenes).map(function(img) {

            return new Promise(function(resolve) {

                if (img.complete) {

                    resolve();

                } else {

                    img.onload =
                        resolve;

                    img.onerror =
                        resolve;

                }

            });

        })

    );

    /*
    =====================================================
    VERIFICAR DIMENSIONES
    =====================================================
    */

    const rect =
        tarjeta.getBoundingClientRect();

    console.log(
        "Tarjeta temporal:",
        rect.width,
        "x",
        rect.height
    );

    if (
        rect.width === 0 ||
        rect.height === 0
    ) {

        document.body.removeChild(
            contenedor
        );

        throw new Error(
            "La tarjeta sigue teniendo dimensiones 0x0."
        );

    }

    /*
    =====================================================
    HTML2CANVAS
    =====================================================
    */

    let canvas;

    try {

        canvas =
            await html2canvas(
                tarjeta,
                {

                    scale: 2,

                    useCORS: true,

                    allowTaint: false,

                    backgroundColor:
                        "#F7FAF8",

                    width: 1080,

                    height: 1350,

                    scrollX: 0,

                    scrollY: 0,

                    windowWidth: 1080,

                    windowHeight: 1350,

                    /*
                    =====================================
                    PROCESAR COPIA
                    =====================================
                    */

                    onclone:
                        function(documentoClonado) {

                            const tarjetaClonada =
                                documentoClonado
                                .getElementById(
                                    "tarjetaExportarCanvas"
                                );

                            if (!tarjetaClonada) {
                                return;
                            }

                            /*
                            ==============================
                            ELIMINAR GRADIENTES
                            ==============================
                            */

                            const elementos =
                                tarjetaClonada
                                .querySelectorAll("*");

                            elementos.forEach(
                                function(elemento) {

                                    try {

                                        const estilo =
                                            documentoClonado
                                            .defaultView
                                            .getComputedStyle(
                                                elemento
                                            );

                                        const fondo =
                                            estilo.backgroundImage;

                                        if (
                                            fondo &&
                                            fondo.includes(
                                                "gradient"
                                            )
                                        ) {

                                            elemento.style
                                                .backgroundImage =
                                                "none";

                                            if (
                                                estilo
                                                .backgroundColor &&
                                                estilo
                                                .backgroundColor !==
                                                "rgba(0, 0, 0, 0)"
                                            ) {

                                                elemento.style
                                                    .backgroundColor =
                                                    estilo
                                                    .backgroundColor;

                                            }

                                        }

                                    } catch(error) {

                                        console.warn(
                                            "Error procesando elemento:",
                                            error
                                        );

                                    }

                                }
                            );

                            /*
                            ==============================
                            ASEGURAR VISIBILIDAD
                            ==============================
                            */

                            tarjetaClonada.style.display =
                                "flex";

                            tarjetaClonada.style.visibility =
                                "visible";

                            tarjetaClonada.style.opacity =
                                "1";

                        }

                }
            );

    } finally {

        /*
        ================================================
        ELIMINAR COPIA TEMPORAL
        ================================================
        */

        if (
            contenedor.parentNode
        ) {

            contenedor.parentNode
                .removeChild(
                    contenedor
                );

        }

    }

    return canvas;
}


// =====================================================
// DESCARGAR TARJETA
// =====================================================

async function descargarTarjeta() {

    try {

        const actualizada =
            await actualizarTarjetaCompartir();


        if (!actualizada) {

            alert(
                "No se pudo cargar la información del progreso."
            );

            return;

        }


        const canvas =
            await generarCanvasTarjeta();


        const enlace =
            document.createElement("a");


        enlace.download =
            "MiProgresoAULNET.png";


        enlace.href =
            canvas.toDataURL(
                "image/png"
            );


        document.body.appendChild(
            enlace
        );


        enlace.click();


        enlace.remove();


        console.log(
            "Tarjeta descargada correctamente."
        );


    } catch (error) {

        console.error(
            "Error al descargar tarjeta:",
            error
        );


        alert(
            "No se pudo generar la tarjeta."
        );

    }

}



// =====================================================
// COMPARTIR WHATSAPP
// =====================================================

async function compartirWhatsApp() {

    try {

        const actualizada =
            await actualizarTarjetaCompartir();

        if (!actualizada) {

            alert(
                "No se pudo cargar la información del progreso."
            );

            return;
        }


        const canvas =
            await generarCanvasTarjeta();


        const texto =
            "Estoy aprendiendo náhuatl con Castores Multilingües AUL@NET 🌱\n\n" +
            "Nechmachtia in náhuatl ipan Castores Multilingües AUL@NET 🌱\n\n" +
            "#Náhuatl #UTP #AULNET #CastoresMultilingües";


        /*
        =================================================
        CREAR IMAGEN
        =================================================
        */

        canvas.toBlob(async function(blob) {

            if (!blob) {

                alert(
                    "No se pudo generar la imagen."
                );

                return;
            }


            const archivo =
                new File(
                    [blob],
                    "MiProgresoAULNET.png",
                    {
                        type: "image/png"
                    }
                );


            /*
            =================================================
            INTENTAR COMPARTIR DIRECTAMENTE
            =================================================
            */

            if (
                navigator.share &&
                navigator.canShare &&
                navigator.canShare({
                    files: [archivo]
                })
            ) {

                try {

                    await navigator.share({

                        files: [archivo],

                        title:
                            "Mi progreso AUL@NET",

                        text:
                            texto

                    });

                    return;

                } catch (error) {

                    /*
                    El usuario pudo cancelar
                    */

                    console.log(
                        "Compartir cancelado:",
                        error
                    );

                }

            }


            /*
            =================================================
            SI NO SE PUEDE COMPARTIR DIRECTAMENTE
            =================================================
            */

            const enlace =
                document.createElement("a");

            enlace.download =
                "MiProgresoAULNET.png";

            enlace.href =
                URL.createObjectURL(blob);

            document.body.appendChild(enlace);

            enlace.click();

            enlace.remove();


            /*
            =================================================
            ABRIR WHATSAPP
            =================================================
            */

            const urlWhatsApp =
                "https://wa.me/?text=" +
                encodeURIComponent(texto);


            setTimeout(function() {

                window.open(
                    urlWhatsApp,
                    "_blank"
                );

            }, 500);

        }, "image/png");


    } catch (error) {

        console.error(
            "Error al compartir en WhatsApp:",
            error
        );

        alert(
            "No se pudo preparar la publicación."
        );

    }

}



// =====================================================
// FACEBOOK
// =====================================================

async function compartirFacebook() {

    try {

        const actualizada =
            await actualizarTarjetaCompartir();

        if (!actualizada) {

            alert(
                "No se pudo cargar la información."
            );

            return;
        }


        /*
        =================================================
        GENERAR TARJETA
        =================================================
        */

        const canvas =
            await generarCanvasTarjeta();


        /*
        =================================================
        DESCARGAR IMAGEN
        =================================================
        */

        canvas.toBlob(function(blob) {

            if (!blob) {

                alert(
                    "No se pudo generar la imagen."
                );

                return;
            }


            const enlace =
                document.createElement("a");


            enlace.download =
                "MiProgresoAULNET.png";


            enlace.href =
                URL.createObjectURL(blob);


            document.body.appendChild(
                enlace
            );


            enlace.click();


            enlace.remove();


            /*
            =================================================
            TEXTO
            =================================================
            */

            const texto =
                "Estoy aprendiendo náhuatl con Castores Multilingües AUL@NET 🌱\n\n" +
                "Nechmachtia in náhuatl ipan Castores Multilingües AUL@NET 🌱\n\n" +
                "#Náhuatl #UTP #AULNET #CastoresMultilingües";


            /*
            =================================================
            ABRIR FACEBOOK
            =================================================
            */

            const urlFacebook =
                "https://www.facebook.com/sharer/sharer.php?u=" +
                encodeURIComponent(
                    window.location.href
                ) +
                "&quote=" +
                encodeURIComponent(
                    texto
                );


            setTimeout(function() {

                window.open(
                    urlFacebook,
                    "facebookCompartir",
                    "width=700,height=600"
                );

            }, 700);


        }, "image/png");


    } catch (error) {

        console.error(
            "Error al compartir en Facebook:",
            error
        );

        alert(
            "No se pudo preparar la publicación."
        );

    }

}



// =====================================================
// X
// =====================================================

async function compartirX() {

    try {

        const actualizada =
            await actualizarTarjetaCompartir();

        if (!actualizada) {

            alert(
                "No se pudo cargar la información."
            );

            return;
        }


        /*
        =================================================
        GENERAR TARJETA
        =================================================
        */

        const canvas =
            await generarCanvasTarjeta();


        /*
        =================================================
        DESCARGAR IMAGEN
        =================================================
        */

        canvas.toBlob(function(blob) {

            if (!blob) {

                alert(
                    "No se pudo generar la imagen."
                );

                return;
            }


            const enlace =
                document.createElement("a");


            enlace.download =
                "MiProgresoAULNET.png";


            enlace.href =
                URL.createObjectURL(blob);


            document.body.appendChild(
                enlace
            );


            enlace.click();


            enlace.remove();


            /*
            =================================================
            TEXTO PARA X
            =================================================
            */

            const texto =
                "Estoy aprendiendo náhuatl con Castores Multilingües AUL@NET 🌱\n\n" +
                "Nechmachtia in náhuatl ipan Castores Multilingües AUL@NET 🌱\n\n" +
                "#Náhuatl #UTP #AULNET #CastoresMultilingües";


            /*
            =================================================
            ABRIR X
            =================================================
            */

            const urlX =
                "https://twitter.com/intent/post?text=" +
                encodeURIComponent(
                    texto
                );


            setTimeout(function() {

                window.open(
                    urlX,
                    "compartirX",
                    "width=700,height=600"
                );

            }, 700);


        }, "image/png");


    } catch (error) {

        console.error(
            "Error al compartir en X:",
            error
        );

        alert(
            "No se pudo preparar la publicación."
        );

    }

}


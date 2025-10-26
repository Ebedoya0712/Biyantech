/* ========================================================================
   FUNCIÓN PRINCIPAL DE CONTEO REGRESIVO (jQuery Plugin)
   Esta función es la que genera el HTML para el contador.
   Se ha modificado para usar etiquetas en español.
   ======================================================================== */
! function(c) {
    function e(n) {ee
        // Añade un cero delante si el número es menor a 10
        return n < 10 ? "0" + n : n
    }
    c.fn.showclock = function() {
        var n = new Date,
            o = c(this).data("date").split("-"),
            s = [0, 0];
        
        // Determina la hora de finalización
        if (null != c(this).data("time") && (s = c(this).data("time").split(":")), (a = new Date(o[0], o[1] - 1, o[2], s[0], s[1]).getTime() / 1e3 - n.getTime() / 1e3) <= 0 || isNaN(a)) return this.hide(), this;
        
        // Cálculos de tiempo restante (Días, Horas, Minutos, Segundos)
        var t = Math.floor(a / 86400); // Días
        a %= 86400;
        o = Math.floor(a / 3600); // Horas
        a %= 3600;
        var s = Math.floor(a / 60), // Minutos
            a = Math.floor(a % 60), // Segundos
            n = "";
        
        // Construcción del HTML con etiquetas en ESPAÑOL
        if (0 != t) {
            n += "<div class='countdown-container days'>";
            n += "<span class='countdown-value days-bottom'>" + e(t) + "</span>";
            n += "<span class='countdown-heading days-top'>Días</span>"; 
            n += "</div>";
        }
        n += "<div class='countdown-container hours'>";
        n += "<span class='countdown-value hours-bottom'>" + e(o) + "</span>";
        n += "<span class='countdown-heading hours-top'>Horas</span>"; 
        n += "</div>";
        n += "<div class='countdown-container minutes'>";
        n += "<span class='countdown-value minutes-bottom'>" + e(s) + "</span>";
        n += "<span class='countdown-heading minutes-top'>Mins</span>"; 
        n += "</div>";
        n += "<div class='countdown-container seconds'>";
        n += "<span class='countdown-value seconds-bottom'>" + e(a) + "</span>";
        n += "<span class='countdown-heading seconds-top'>Segs</span>"; 
        this.html(n += "</div>")
    }, c.fn.countdown = function() {
        var n = c(this);
        n.showclock(), setInterval(function() {
            n.showclock()
        }, 1e3)
    }
}(jQuery);


// ========================================================================
// FUNCIONES DE SOPORTE PARA EL ELEMENTO ESPECÍFICO (Versiones 'T')
// Estas funciones se encargan de inicializar y actualizar el contador.
// ========================================================================

jQuery(document).ready(function() {
    // Inicializa el contador si existe el elemento con clase .countdown
    if (0 < jQuery(".countdown").length) {
        jQuery(".countdown").each(function() {
            countdownT();
        });
    }
});


function eT(n) {
    // Añade un cero delante si el número es menor a 10
    return n < 10 ? "0" + n : n
}

function showclockT() {
    var n = new Date,
        o = jQuery(".countdown").data("date").split("-"),
        s = [0, 0];
    if (null != jQuery(".countdown").data("time") && (s = jQuery(".countdown").data("time").split(":")), (a = new Date(o[0], o[1] - 1, o[2], s[0], s[1]).getTime() / 1e3 - n.getTime() / 1e3) <= 0 || isNaN(a)) return this.hide(), this;
    var t = Math.floor(a / 86400);
    a %= 86400;
    o = Math.floor(a / 3600);
    a %= 3600;
    var s = Math.floor(a / 60),
        a = Math.floor(a % 60),
        n = "";
    
    // Construcción del HTML con etiquetas en ESPAÑOL
    if (0 != t) {
        n += "<div class='countdown-container days'>";
        n += "<span class='countdown-value days-bottom'>" + eT(t) + "</span>";
        n += "<span class='countdown-heading days-top'>Días</span>"; 
        n += "</div>";
    }
    n += "<div class='countdown-container hours'>";
    n += "<span class='countdown-value hours-bottom'>" + eT(o) + "</span>";
    n += "<span class='countdown-heading hours-top'>Horas</span>"; 
    n += "</div>";
    n += "<div class='countdown-container minutes'>";
    n += "<span class='countdown-value minutes-bottom'>" + eT(s) + "</span>";
    n += "<span class='countdown-heading minutes-top'>Mins</span>"; 
    n += "</div>";
    n += "<div class='countdown-container seconds'>";
    n += "<span class='countdown-value seconds-bottom'>" + eT(a) + "</span>";
    n += "<span class='countdown-heading seconds-top'>Segs</span>"; 
    jQuery(".countdown").html(n += "</div>")
}

function countdownT() {
    showclockT()
    setInterval(function() {
        showclockT()
    }, 1e3) // Actualiza cada 1000 milisegundos (1 segundo)
}
import { TESTIMONIOS } from "./testimonios.js";

/**
 * ============================================================
 * CONFIGURACIÓN DEL NEGOCIO
 * Edita estos valores con los datos reales antes de publicar.
 * ============================================================
 */
const CONFIG = {
  numeroWhatsApp: "5356395148",     // TODO: formato internacional, solo números, sin "+"
  instagramUrl: "https://instagram.com/usuario",   // TODO
  facebookUrl: "https://facebook.com/usuario",     // TODO (si no aplica, deja el enlace vacío "")
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=DIRECCION_AQUI", // TODO
  mensajeReservaRapida: "Hola, quisiera reservar un masaje."
};

document.addEventListener("DOMContentLoaded", () => {
  aplicarConfig();
  renderTestimonios();
  configurarMenuMovil();
  configurarFormularioContacto();
  document.getElementById("anio").textContent = new Date().getFullYear();
});

/**
 * Aplica los datos de CONFIG a los enlaces del sitio (WhatsApp, redes, mapa).
 */
function aplicarConfig() {
  const linkWhatsApp = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(CONFIG.mensajeReservaRapida)}`;

  document.getElementById("ctaReservarNav").href = linkWhatsApp;
  document.getElementById("ctaReservarHero").href = linkWhatsApp;

  document.getElementById("linkMaps").href = CONFIG.mapsUrl;
  document.getElementById("linkInstagram").href = CONFIG.instagramUrl;

  const linkFacebook = document.getElementById("linkFacebook");
  if (CONFIG.facebookUrl) {
    linkFacebook.href = CONFIG.facebookUrl;
  } else {
    linkFacebook.style.display = "none";
  }
}

/**
 * Dibuja los testimonios definidos en testimonios.js
 */
function renderTestimonios() {
  const contenedor = document.getElementById("testimoniosLista");
  contenedor.innerHTML = TESTIMONIOS.map(t => `
    <blockquote class="testimonial">
      <p>"${escaparHTML(t.texto)}"</p>
      <cite>${escaparHTML(t.autor)}</cite>
    </blockquote>
  `).join("");
}

function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

/**
 * Menú hamburguesa en móvil
 */
function configurarMenuMovil() {
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");

  toggle.addEventListener("click", () => {
    const abierto = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * Formulario de contacto: arma el mensaje y abre WhatsApp.
 * Incluye un campo honeypot ("sitioWeb") invisible para personas:
 * si viene lleno, es casi seguro un bot, y se ignora el envío.
 */
function configurarFormularioContacto() {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const honeypot = form.sitioWeb.value.trim();
    if (honeypot !== "") {
      // Envío de bot: no hacemos nada, ni siquiera mostramos error.
      return;
    }

    const nombre = form.nombre.value.trim();
    const problema = form.problema.value.trim();

    if (!nombre || !problema) return;

    const mensaje =
      `Hola, soy ${nombre}. Quisiera reservar una sesión.\n` +
      `Lo que me gustaría trabajar: ${problema}`;

    const link = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(link, "_blank", "noopener");
    form.reset();
  });
}

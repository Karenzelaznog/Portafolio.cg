document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     AÑO ACTUAL EN EL FOOTER
     ========================================================= */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* =========================================================
     MENÚ HAMBURGUESA RESPONSIVE
     ========================================================= */
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  function closeMenu() {
    mainNav.classList.remove("is-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("is-open");
      menuToggle.classList.toggle("is-active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Cierra el menú al elegir una sección (mejora la navegación en móvil)
    mainNav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  /* =========================================================
     ANIMACIÓN DE BARRAS DE HABILIDADES AL ENTRAR EN VISTA
     ========================================================= */
  const skillItems = document.querySelectorAll(".skill");

  const skillObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector(".skill-bar");
          const level = entry.target.getAttribute("data-level");
          bar.style.width = level + "%";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  skillItems.forEach((item) => skillObserver.observe(item));

  /* =========================================================
     VALIDACIÓN DE FORMULARIO EN TIEMPO REAL
     ========================================================= */
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success");

  const validators = {
    name: (value) => {
      if (value.trim().length === 0) return "Escribe tu nombre.";
      if (value.trim().length < 2) return "El nombre es demasiado corto.";
      return "";
    },
    email: (value) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.trim().length === 0) return "Escribe tu correo.";
      if (!pattern.test(value.trim())) return "Escribe un correo válido.";
      return "";
    },
    message: (value) => {
      if (value.trim().length === 0) return "Escribe un mensaje.";
      if (value.trim().length < 10) return "Cuéntame un poco más (mínimo 10 caracteres).";
      return "";
    },
  };

  function validateField(input) {
    const errorEl = document.getElementById(input.id + "-error");
    const message = validators[input.name] ? validators[input.name](input.value) : "";

    input.closest(".form-field").classList.toggle("has-error", Boolean(message));
    if (errorEl) errorEl.textContent = message;

    return message === "";
  }

  if (form) {
    const fields = form.querySelectorAll("input[name], textarea[name]");

    fields.forEach((field) => {
      // Valida mientras la persona escribe, para feedback inmediato
      field.addEventListener("input", () => validateField(field));
      field.addEventListener("blur", () => validateField(field));
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let isFormValid = true;
      fields.forEach((field) => {
        const valid = validateField(field);
        if (!valid) isFormValid = false;
      });

      if (isFormValid) {
        successMessage.textContent = "¡Gracias! Tu mensaje fue enviado correctamente.";
        form.reset();
        fields.forEach((field) => field.closest(".form-field").classList.remove("has-error"));
      } else {
        successMessage.textContent = "";
      }
    });
  }

});

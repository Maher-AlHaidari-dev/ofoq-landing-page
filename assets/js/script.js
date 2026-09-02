"use strict";

document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     OFOQ LANDING PAGE
     Lightweight • Secure • Performance-focused
     ========================================================= */

  const header = document.getElementById("header");
  const nav = document.getElementById("mainNav");
  const menuToggle = document.getElementById("menuToggle");

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  /* =========================================================
     MOBILE MENU
     ========================================================= */

  const closeMenu = () => {
    if (!nav || !menuToggle) return;

    nav.classList.remove("open");
    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "فتح القائمة");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.className = "fa-solid fa-bars";
    }
  };

  const openMenu = () => {
    if (!nav || !menuToggle) return;

    nav.classList.add("open");
    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "إغلاق القائمة");

    const icon = menuToggle.querySelector("i");

    if (icon) {
      icon.className = "fa-solid fa-xmark";
    }
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.contains("open");

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  /* إغلاق القائمة عند اختيار رابط */

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  /* إغلاق القائمة عند الضغط خارجها */

  document.addEventListener("click", (event) => {
    if (!nav?.classList.contains("open")) return;

    const clickedInsideNav = nav.contains(event.target);
    const clickedToggle = menuToggle?.contains(event.target);

    if (!clickedInsideNav && !clickedToggle) {
      closeMenu();
    }
  });

  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      let target;

      try {
        target = document.querySelector(targetId);
      } catch {
        return;
      }

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight = header?.offsetHeight ?? 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        10;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth"
      });
    });
  });

  /* =========================================================
     HEADER SCROLL STATE
     ========================================================= */

  let ticking = false;

  const updateHeader = () => {
    if (!header) {
      ticking = false;
      return;
    }

    header.classList.toggle(
      "scrolled",
      window.scrollY > 20
    );

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );

  /* =========================================================
     ACTIVE NAVIGATION
     باستخدام IntersectionObserver
     ========================================================= */

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio -
              a.intersectionRatio
          );

        if (!visibleSections.length) {
          return;
        }

        const currentId =
          visibleSections[0].target.id;

        navLinks.forEach((link) => {
          const isActive =
            link.getAttribute("href") === `#${currentId}`;

          link.classList.toggle(
            "active",
            isActive
          );
        });
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });
  } else {
    /* =======================================================
       FALLBACK للمتصفحات القديمة
       ======================================================= */

    let scrollTicking = false;

    const updateActiveLink = () => {
      const position =
        window.scrollY +
        (header?.offsetHeight ?? 0) +
        100;

      let currentId = "hero";

      sections.forEach((section) => {
        if (position >= section.offsetTop) {
          currentId = section.id;
        }
      });

      navLinks.forEach((link) => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${currentId}`
        );
      });

      scrollTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!scrollTicking) {
          window.requestAnimationFrame(
            updateActiveLink
          );

          scrollTicking = true;
        }
      },
      { passive: true }
    );

    updateActiveLink();
  }

  /* =========================================================
     ESC لإغلاق القائمة
     ========================================================= */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  /* =========================================================
     معالجة تغيير حجم الشاشة
     ========================================================= */

  window.addEventListener(
    "resize",
    () => {
      if (
        window.innerWidth > 760 &&
        nav?.classList.contains("open")
      ) {
        closeMenu();
      }
    },
    { passive: true }
  );

  /* =========================================================
     الحالة الأولية
     ========================================================= */

  updateHeader();
});
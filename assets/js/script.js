document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section");

  // 1. التمرير السلس عند الضغط على أي رابط في القائمة العلوية
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      
      if (targetId === "#") return;
      
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // حساب ارتفاع الهيدر الثابت لعدم تغطية عنوان القسم
        const header = document.querySelector(".header");
        const headerHeight = header ? header.offsetHeight : 0;
        const sectionPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
          top: sectionPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // 2. تغيير الرابط النشط (Active Link) تلقائياً عند تمرير الصفحة
  window.addEventListener("scroll", () => {
    let currentSectionId = "";
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });
});
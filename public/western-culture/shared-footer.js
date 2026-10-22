(() => {
  const install = () => {
    if (!document.querySelector('link[data-shared-campus-footer]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/western-culture/shared-footer.css";
      link.dataset.sharedCampusFooter = "true";
      document.head.append(link);
    }

    let footer = document.querySelector("footer.university-footer, footer.review-site-footer, footer.quiz-footer");
    if (!footer) {
      footer = document.createElement("footer");
      footer.className = "university-footer";
      footer.setAttribute("aria-label", "China West Normal University");
      footer.innerHTML = '<div class="university-identity"><strong>CHINA WEST NORMAL</strong><em>UNIVERSITY</em><img src="/western-culture/allusions-assets/university-seal.png" width="78" height="78" alt="China West Normal University seal"></div><small>© 2026 China West Normal University</small>';
      document.body.append(footer);
    }
    footer.classList.add("shared-campus-footer");
    const seal=footer.querySelector("img");
    if(seal) seal.src="/western-culture/allusions-assets/university-seal.png";
    else { const image=document.createElement("img"); image.src="/western-culture/allusions-assets/university-seal.png"; image.width=78; image.height=78; image.alt="China West Normal University seal"; footer.querySelector(".university-identity, .quiz-footer-name")?.append(image); }
    if(!footer.querySelector("small")){const copyright=document.createElement("small");copyright.textContent="© 2026 China West Normal University";footer.append(copyright);}
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", install, { once: true });
  else install();
})();

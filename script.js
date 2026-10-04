// ==========================================
// PORTFOLIO JAVASCRIPT
// ==========================================

// ==========================================
// EMAILJS CONFIG
// ==========================================
const EMAILJS_PUBLIC_KEY = "I1ZW9am3yBcdX0ez-";
const EMAILJS_SERVICE_ID = "service_sq5bi08";
const EMAILJS_TEMPLATE_ID = "template_z6ijerv";

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("open");
            menuBtn.textContent = mobileMenu.classList.contains("open") ? "Close" : "Menu";
        });

        mobileMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("open");
                menuBtn.textContent = "Menu";
            });
        });
    }

    // ==========================================
    // CURRENT YEAR
    // ==========================================
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ==========================================
    // SCROLL REVEAL ANIMATION (with stagger)
    // ==========================================
    const revealElements = document.querySelectorAll(".reveal");

    function applyStaggerDelays() {
        const parents = new Map();

        revealElements.forEach(el => {
            const parent = el.parentElement;
            if (!parents.has(parent)) {
                parents.set(parent, []);
            }
            parents.get(parent).push(el);
        });

        parents.forEach(group => {
            group.forEach((el, index) => {
                const delay = (index % 6) + 1;
                el.setAttribute("data-delay", String(delay));
            });
        });
    }

    applyStaggerDelays();

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // SCROLL PROGRESS
    // ==========================================
    const scrollProgress = document.getElementById("scrollProgress");

    function updateScrollProgress() {
        if (!scrollProgress) return;

        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (documentHeight <= 0) return;

        const progress = Math.min(scrollTop / documentHeight, 1);
        scrollProgress.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener("scroll", updateScrollProgress, { passive: true });

    // ==========================================
    // NAVBAR SHADOW ON SCROLL
    // ==========================================
    const navbar = document.getElementById("navbar");

    function updateNavbar() {
        if (!navbar) return;

        if (window.scrollY > 40) {
            navbar.classList.add("shadow-sm");
        } else {
            navbar.classList.remove("shadow-sm");
        }
    }

    window.addEventListener("scroll", updateNavbar, { passive: true });

    // ==========================================
    // SMOOTH ANCHOR SCROLL
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        });
    });

    // ==========================================
    // CONTACT FORM + EMAILJS
    // ==========================================
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const submitButton = document.getElementById("submitButton");

    // Init EmailJS
    if (typeof emailjs !== "undefined") {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
    }

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const subject = document.getElementById("subject").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !subject || !message) {
                showFormStatus("Please fill in all fields.", "error");
                return;
            }

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                showFormStatus("Please enter a valid email address.", "error");
                return;
            }

            if (typeof emailjs === "undefined") {
                showFormStatus("EmailJS library failed to load. Check your internet connection.", "error");
                return;
            }

            const originalBtnHTML = submitButton ? submitButton.innerHTML : "";
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = "Sending...";
            }

            const templateParams = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                time: new Date().toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short"
                })
            };

            emailjs
                .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(function () {
                    showFormStatus("Message sent successfully! I'll get back to you soon.", "success");
                    contactForm.reset();
                })
                .catch(function (error) {
                    console.error("EmailJS error:", error);
                    const detail = (error && error.text) || (error && error.message) || "Unknown error";
                    showFormStatus("Failed to send: " + detail, "error");
                })
                .finally(function () {
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalBtnHTML;
                    }
                });
        });
    }

    // ==========================================
    // FORM STATUS
    // ==========================================
    function showFormStatus(message, type) {
        if (!formStatus) return;

        formStatus.textContent = message;
        formStatus.classList.remove("hidden", "text-red-600", "text-green-600");

        if (type === "error") {
            formStatus.classList.add("text-red-600");
        } else {
            formStatus.classList.add("text-green-600");
        }
    }

    // ==========================================
    // INITIAL PAGE SETUP
    // ==========================================
    updateScrollProgress();
    updateNavbar();

});
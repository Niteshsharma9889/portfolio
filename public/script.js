// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
});

// Close mobile menu when clicking on a link
document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }),
);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    });
});

// Header scroll effect
window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (window.scrollY > 100) {
        header.style.background = "rgba(255, 255, 255, 0.98)";
        header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
        header.style.background = "rgba(255, 255, 255, 0.95)";
        header.style.boxShadow = "none";
    }
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
    const animateElements = document.querySelectorAll(
        ".project-card, .skill-category, .about-stats",
    );
    animateElements.forEach((el) => {
        el.classList.add("fade-in");
        observer.observe(el);
    });
});

// EmailJS will be initialized from the server-provided config

// Contact form handling
const contactForm = document.querySelector(".contact-form");
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    // Simple validation
    if (!name || !email || !subject || !message) {
        alert("Please fill in all fields");
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
    }

    // Disable submit button and show loading
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    try {
        // Get EmailJS config from server
        const configResponse = await fetch('/api/emailjs-config');
        const config = await configResponse.json();
        
        // Initialize EmailJS with server-provided key
        if (typeof emailjs !== 'undefined' && config.publicKey) {
            emailjs.init(config.publicKey);
        }
        
        // Send email using EmailJS
        await emailjs.send(
            config.serviceId,
            config.templateId,
            {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: "niteshsharma9670@gmail.com",
            },
        );

        // Also log to backend
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, subject, message }),
        });

        const result = await response.json();

        if (result.success) {
            alert("Email sent successfully! " + result.message);
            contactForm.reset();
        } else {
            alert("Form logged but email may have failed: " + result.message);
        }
    } catch (error) {
        console.error("Error sending email:", error);
        alert(
            "Sorry, there was an error sending your email. Please try again.",
        );
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    }
});

// Typing animation for hero subtitle
const subtitleElement = document.querySelector(".hero-subtitle");
const subtitleText = "Full Stack Developer & Software Engineer";
let index = 0;

function typeWriter() {
    if (index < subtitleText.length) {
        subtitleElement.textContent = subtitleText.substring(0, index + 1);
        index++;
        setTimeout(typeWriter, 100);
    }
}

// Start typing animation when page loads
window.addEventListener("load", () => {
    subtitleElement.textContent = "";
    setTimeout(typeWriter, 1000);
});

// Add active class to current navigation item
window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// Particle animation for hero background
function createParticles() {
    const hero = document.querySelector(".hero");
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.width = "2px";
        particle.style.height = "2px";
        particle.style.background = "rgba(255, 255, 255, 0.5)";
        particle.style.borderRadius = "50%";
        particle.style.left = Math.random() * 100 + "%";
        particle.style.top = Math.random() * 100 + "%";
        particle.style.animation = `float ${Math.random() * 3 + 2}s infinite linear`;
        hero.appendChild(particle);
    }
}

// CSS for particle animation
const style = document.createElement("style");
style.textContent = `
    @keyframes float {
        0% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        100% { transform: translateY(-1000px) rotate(360deg); opacity: 0; }
    }

    .nav-link.active {
        color: #667eea !important;
    }
`;
document.head.appendChild(style);

// Initialize particles
createParticles();

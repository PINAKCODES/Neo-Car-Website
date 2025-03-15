document.addEventListener("DOMContentLoaded", function () {
  // Logo redirection
  const logo = document.querySelector(".logo");
  logo.addEventListener("click", function () {
    window.location.href = "#";
    smoothScrollTo(0, 1000); // Smooth scroll to top with custom duration
  });
  logo.style.cursor = "pointer";

  // Create scroll progress indicator
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  // Update scroll progress indicator
  window.addEventListener("scroll", function () {
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });

  // Custom smooth scroll function with adjustable duration
  function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Easing function for smoother animation
    function easeInOutQuad(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // Enhanced Circular Showcase with 3D effect
  const carCards = document.querySelectorAll(".car-card");
  const prevBtn = document.querySelector(".control-btn.prev");
  const nextBtn = document.querySelector(".control-btn.next");
  let activeIndex = 0;
  const totalCards = carCards.length;
  const radius = 700; // Increased distance from center for better 3D effect with more cards

  // Position cards in a circle with enhanced 3D animation
  function arrangeCards() {
    const angleStep = (2 * Math.PI) / totalCards;

    carCards.forEach((card, index) => {
      // Remove any active class first
      card.classList.remove("active");

      // Calculate the angle offset from the active card
      const angleOffset = ((index - activeIndex) * angleStep) % (2 * Math.PI);

      // Calculate position based on angle
      const x = radius * Math.sin(angleOffset);
      const z = radius * Math.cos(angleOffset) - radius;
      const rotateY = (angleOffset * 180) / Math.PI;

      // Apply transform with enhanced depth
      card.style.transform = `translate(-50%, -50%) rotateY(${rotateY}deg) translateZ(${z}px) translateX(${x}px)`;

      // Set z-index, opacity and scale based on position
      let distance = Math.abs(index - activeIndex);
      if (distance > totalCards / 2) {
        distance = totalCards - distance;
      }

      const zIndex = 10 - distance;
      const opacity = 1 - distance * 0.15; // Reduced opacity falloff for more cards
      const scale = 1 - distance * 0.08; // Reduced scale falloff for more cards

      card.style.zIndex = zIndex;
      card.style.opacity = opacity > 0.4 ? opacity : 0.4;
      card.style.scale = scale > 0.7 ? scale : 0.7;

      // Add transition delay for smoother animation
      card.style.transitionDelay = `${index * 0.02}s`; // Reduced delay for more cards
    });

    // Add active class to current card
    carCards[activeIndex].classList.add("active");
  }

  // Initialize card positions
  arrangeCards();

  // Auto-rotate the carousel slowly
  let autoRotateInterval;
  let userSelected = true;

  function startAutoRotate() {
    if (!userSelected) {
      autoRotateInterval = setInterval(() => {
        activeIndex = (activeIndex + 1) % totalCards;
        arrangeCards();
        updateIndicators();
      }, 5000); // Rotate every 5 seconds
    }
  }

  function stopAutoRotate() {
    clearInterval(autoRotateInterval);
  }

  // Start auto-rotation initially
  startAutoRotate();

  // Stop rotation on hover, but only restart if user hasn't made a selection
  document
    .querySelector(".circular-showcase")
    .addEventListener("mouseenter", stopAutoRotate);
  document
    .querySelector(".circular-showcase")
    .addEventListener("mouseleave", () => {
      if (!userSelected) {
        startAutoRotate();
      }
    });

  // Enhanced hover effect for cards
  carCards.forEach((card, index) => {
    card.addEventListener("mouseenter", () => {
      if (index !== activeIndex) {
        card.style.zIndex = 9;
        card.style.opacity = 0.9;
        card.style.transform = card.style.transform.replace(
          "scale(1)",
          "scale(1.15)"
        );
      }
    });

    card.addEventListener("mouseleave", () => {
      if (index !== activeIndex) {
        setTimeout(() => {
          arrangeCards(); // Reset to original position with a slight delay
        }, 100);
      }
    });
  });

  // Add carousel indicators functionality
  const carouselIndicators = document.querySelectorAll(".carousel-indicator");

  // Update indicators when active card changes
  function updateIndicators() {
    carouselIndicators.forEach((indicator, index) => {
      if (index === activeIndex) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  // Add click event to indicators
  carouselIndicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      activeIndex = index;
      arrangeCards();
      updateIndicators();

      // Stop auto-rotation and mark as user selected
      stopAutoRotate();
      userSelected = true;
    });
  });

  // Update indicators when using prev/next buttons
  prevBtn.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + totalCards) % totalCards;
    arrangeCards();
    updateIndicators();

    // Add button press effect
    prevBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      prevBtn.style.transform = "scale(1)";
    }, 200);

    // Stop auto-rotation and mark as user selected
    stopAutoRotate();
    userSelected = true;
  });

  nextBtn.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % totalCards;
    arrangeCards();
    updateIndicators();

    // Add button press effect
    nextBtn.style.transform = "scale(0.95)";
    setTimeout(() => {
      nextBtn.style.transform = "scale(1)";
    }, 200);

    // Stop auto-rotation and mark as user selected
    stopAutoRotate();
    userSelected = true;
  });

  // Card click event with enhanced animation
  carCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (index === activeIndex) {
        // Add pop effect before opening modal
        card.style.transition =
          "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        card.style.transform = card.style.transform + " scale(1.1)";
        card.style.boxShadow = "0 0 30px rgba(255, 43, 74, 0.5)";

        setTimeout(() => {
          openModal(card);
          // Reset after opening modal
          setTimeout(() => {
            arrangeCards();
            card.style.boxShadow = "";
          }, 100);
        }, 300);
      } else {
        // Smooth transition to clicked card
        carCards.forEach((c) => {
          c.style.transition =
            "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        });

        activeIndex = index;
        arrangeCards();
        updateIndicators();

        // Stop auto-rotation and mark as user selected
        stopAutoRotate();
        userSelected = true;

        // Reset transition after animation completes
        setTimeout(() => {
          carCards.forEach((c) => {
            c.style.transition = "all 0.4s ease";
          });
        }, 800);
      }
    });
  });

  // Enhanced scroll animations with reveal effects
  const revealOnScroll = () => {
    const revealElements = document.querySelectorAll(
      ".reveal, .reveal-stagger"
    );
    const windowHeight = window.innerHeight;
    const revealPoint = 150; // Distance from bottom of viewport to trigger animation

    revealElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("active");
      } else {
        element.classList.remove("active");
      }
    });

    // Original animation for other elements
    const elements = document.querySelectorAll(
      ".featured-card, .category-card, .about-content, .stat-item, .testimonial-card, .contact-container"
    );

    elements.forEach((element, index) => {
      const elementPosition = element.getBoundingClientRect().top;
      const screenPosition = windowHeight / 1.2; // Show elements sooner

      if (elementPosition < screenPosition) {
        // Faster animation with shorter staggered delay
        setTimeout(() => {
          element.classList.add("animate");
        }, index * 50); // Reduced from 100ms to 50ms
      }
    });
  };

  // Apply fade-in animation to body when page loads
  document.body.classList.add("fade-in");

  // Add smooth-hover class to interactive elements
  document
    .querySelectorAll(
      ".cyber-btn, .category-card, .featured-card, .social-link, .footer-tech-icons i, .social-icon, .footer-column ul li a"
    )
    .forEach((el) => {
      el.classList.add("smooth-hover");
    });

  // Initialize reveal animations
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("resize", revealOnScroll);

  // Initial check for animations
  setTimeout(() => {
    revealOnScroll();
  }, 100);

  // Enhanced parallax effect for hero section
  const hero = document.querySelector(".hero");
  let lastScrollY = window.pageYOffset;
  let ticking = false;

  window.addEventListener("scroll", () => {
    lastScrollY = window.pageYOffset;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Smoother parallax effect
        if (lastScrollY <= window.innerHeight) {
          hero.style.backgroundPositionY = `${lastScrollY * 0.4}px`;

          // Add subtle opacity effect to hero content
          const heroContent = document.querySelector(".hero-content");
          heroContent.style.opacity =
            1 - lastScrollY / (window.innerHeight * 1.5);
        }
        ticking = false;
      });

      ticking = true;
    }
  });

  // Enhanced button hover effects
  const cyberBtns = document.querySelectorAll(".cyber-btn");

  cyberBtns.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.classList.add("glitch");
      btn.style.transform = "translateY(-3px)";
      btn.style.boxShadow =
        "0 10px 20px rgba(0, 0, 0, 0.2), 0 0 15px var(--primary)";

      setTimeout(() => {
        btn.classList.remove("glitch");
      }, 1000);
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0)";
      btn.style.boxShadow = "";
    });
  });

  // Testimonials Slider
  const testimonialCards = document.querySelectorAll(".testimonial-card");
  const testimonialIndicators = document.querySelectorAll(
    ".testimonial-indicators .indicator"
  );
  const testimonialPrevBtn = document.querySelector(".testimonial-btn.prev");
  const testimonialNextBtn = document.querySelector(".testimonial-btn.next");
  let activeTestimonial = 0;

  function showTestimonial(index) {
    testimonialCards.forEach((card) => card.classList.remove("active"));
    testimonialIndicators.forEach((indicator) =>
      indicator.classList.remove("active")
    );

    testimonialCards[index].classList.add("active");
    testimonialIndicators[index].classList.add("active");
  }

  testimonialPrevBtn.addEventListener("click", () => {
    activeTestimonial =
      (activeTestimonial - 1 + testimonialCards.length) %
      testimonialCards.length;
    showTestimonial(activeTestimonial);
  });

  testimonialNextBtn.addEventListener("click", () => {
    activeTestimonial = (activeTestimonial + 1) % testimonialCards.length;
    showTestimonial(activeTestimonial);
  });

  testimonialIndicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      activeTestimonial = index;
      showTestimonial(activeTestimonial);
    });
  });

  // Auto-rotate testimonials
  setInterval(() => {
    activeTestimonial = (activeTestimonial + 1) % testimonialCards.length;
    showTestimonial(activeTestimonial);
  }, 8000);

  // Modal functionality with enhanced forms
  const modal = document.getElementById("carModal");
  const loginModal = document.getElementById("loginModal");
  const testDriveModal = document.getElementById("testDriveModal");
  const financingModal = document.getElementById("financingModal");

  // Generic function to open any modal
  function openGenericModal(modalElement) {
    if (modalElement) {
      modalElement.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  // Generic function to close any modal
  function closeGenericModal(modalElement) {
    if (modalElement) {
      modalElement.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }

  function openModal(card) {
    // Get data from the clicked card
    const cardImg = card.querySelector("img").src;
    const cardTitle = card.querySelector("h3").textContent;
    const cardPrice = card.querySelector(".price").textContent;
    const cardSpecs = card.querySelector(".specs").innerHTML;

    // Ensure the modal elements are properly selected
    const modalImageElement = document.querySelector(
      "#carModal .modal-image img"
    );
    const modalTitleElement = document.querySelector("#carModal .modal-title");
    const modalPriceElement = document.querySelector("#carModal .modal-price");
    const modalSpecsElement = document.querySelector("#carModal .modal-specs");

    // Set the modal content
    if (modalImageElement) modalImageElement.src = cardImg;
    if (modalTitleElement) modalTitleElement.textContent = cardTitle;
    if (modalPriceElement) modalPriceElement.textContent = cardPrice;
    if (modalSpecsElement) modalSpecsElement.innerHTML = cardSpecs;

    // Open the modal
    openGenericModal(modal);

    // Get the test drive and financing buttons in the car modal
    const testDriveBtn = modal.querySelector(
      ".modal-actions .cyber-btn.primary"
    );
    const financingBtn = modal.querySelector(
      ".modal-actions .cyber-btn.secondary"
    );

    // Remove old event listeners by cloning and replacing the buttons
    const newTestDriveBtn = testDriveBtn.cloneNode(true);
    const newFinancingBtn = financingBtn.cloneNode(true);
    testDriveBtn.parentNode.replaceChild(newTestDriveBtn, testDriveBtn);
    financingBtn.parentNode.replaceChild(newFinancingBtn, financingBtn);

    // Add new event listeners to the cloned buttons
    newTestDriveBtn.addEventListener("click", () => {
      closeGenericModal(modal);
      openGenericModal(testDriveModal);

      // Pre-fill the car name in the test drive form
      const carNameInput = document.getElementById("test-drive-car");
      if (carNameInput) {
        carNameInput.value = cardTitle;
      }
    });

    newFinancingBtn.addEventListener("click", () => {
      closeGenericModal(modal);
      openGenericModal(financingModal);

      // Pre-fill the car name and price in the financing form
      const carNameInput = document.getElementById("finance-car");
      const carPriceInput = document.getElementById("finance-price");
      if (carNameInput) {
        carNameInput.value = cardTitle;
      }
      if (carPriceInput) {
        // Extract numeric value from price string (remove $ and ,)
        const priceValue = cardPrice.replace(/[$,]/g, "");
        carPriceInput.value = priceValue;

        // Trigger calculation after setting the price
        if (window.calculateMonthlyPayment) {
          window.calculateMonthlyPayment();
        }
      }
    });
  }

  function closeModal() {
    closeGenericModal(modal);
  }

  // Set up all modal close buttons
  document.querySelectorAll(".modal-close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", function () {
      const parentModal = this.closest(".modal");
      closeGenericModal(parentModal);
    });
  });

  // Close modal when clicking outside content
  document.querySelectorAll(".modal").forEach((modalElement) => {
    modalElement.addEventListener("click", (e) => {
      if (e.target === modalElement) {
        closeGenericModal(modalElement);
      }
    });
  });

  // Login button functionality
  const loginBtn = document.querySelector(".login-btn");
  if (loginBtn && loginModal) {
    loginBtn.addEventListener("click", () => {
      openGenericModal(loginModal);
    });
  }

  // Handle form submissions with validation
  document.querySelectorAll(".modal-form").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Simple validation
      let valid = true;
      const inputs = form.querySelectorAll("input, textarea, select");

      inputs.forEach((input) => {
        if (input.hasAttribute("required") && !input.value.trim()) {
          valid = false;
          input.classList.add("error");

          // Add error message if it doesn't exist
          let errorMsg = input.parentElement.querySelector(".error-message");
          if (!errorMsg) {
            errorMsg = document.createElement("div");
            errorMsg.className = "error-message";
            errorMsg.textContent = "This field is required";
            input.parentElement.appendChild(errorMsg);
          }
        } else {
          input.classList.remove("error");
          const errorMsg = input.parentElement.querySelector(".error-message");
          if (errorMsg) {
            errorMsg.remove();
          }
        }
      });

      if (valid) {
        // Simulate form submission
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = "<span>Processing...</span>";
        submitBtn.disabled = true;

        setTimeout(() => {
          submitBtn.innerHTML =
            '<span>Success!</span><i class="fas fa-check"></i>';

          // Show success message
          const successMsg = document.createElement("div");
          successMsg.className = "success-message";

          if (form.id === "login-form") {
            successMsg.textContent = "Login successful! Redirecting...";
          } else if (form.id === "test-drive-form") {
            successMsg.textContent =
              "Test drive scheduled! We'll contact you shortly.";
          } else if (form.id === "financing-form") {
            successMsg.textContent =
              "Financing application received! Our team will review it.";
          } else {
            successMsg.textContent = "Form submitted successfully!";
          }

          form.appendChild(successMsg);

          // Close modal after delay
          setTimeout(() => {
            closeGenericModal(form.closest(".modal"));
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            successMsg.remove();
          }, 2000);
        }, 1500);
      }
    });
  });

  // Add input animation for all form fields
  document
    .querySelectorAll(
      ".form-group input, .form-group textarea, .form-group select"
    )
    .forEach((input) => {
      // Add active class when input has value
      if (input.value) {
        input.parentElement.classList.add("active");
      }

      // Add event listeners for focus and blur
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("active");
      });

      input.addEventListener("blur", () => {
        if (!input.value) {
          input.parentElement.classList.remove("active");
        }
      });
    });

  // Initialize date picker for test drive scheduling
  const dateInputs = document.querySelectorAll('input[type="date"]');
  dateInputs.forEach((input) => {
    // Set min date to today
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    input.min = `${yyyy}-${mm}-${dd}`;

    // Set max date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    const maxDd = String(maxDate.getDate()).padStart(2, "0");
    const maxMm = String(maxDate.getMonth() + 1).padStart(2, "0");
    const maxYyyy = maxDate.getFullYear();
    input.max = `${maxYyyy}-${maxMm}-${maxDd}`;
  });

  // Financing calculator functionality
  function initFinancingCalculator() {
    const priceInput = document.getElementById("finance-price");
    const downPaymentInput = document.getElementById("finance-down-payment");
    const termSelect = document.getElementById("finance-term");
    const rateInput = document.getElementById("finance-rate");
    const monthlyPaymentOutput = document.getElementById("monthly-payment");

    function calculateMonthlyPayment() {
      if (
        priceInput &&
        downPaymentInput &&
        termSelect &&
        rateInput &&
        monthlyPaymentOutput
      ) {
        const price = parseFloat(priceInput.value) || 0;
        const downPayment = parseFloat(downPaymentInput.value) || 0;
        const term = parseInt(termSelect.value) || 36;
        const rate = parseFloat(rateInput.value) || 3.9;

        // Ensure down payment is not greater than price
        if (downPayment > price) {
          downPaymentInput.value = price;
          return calculateMonthlyPayment();
        }

        const loanAmount = price - downPayment;
        const monthlyRate = rate / 100 / 12;

        let monthlyPayment = 0;
        if (monthlyRate > 0) {
          monthlyPayment =
            (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, term)) /
            (Math.pow(1 + monthlyRate, term) - 1);
        } else {
          // If rate is 0, simple division
          monthlyPayment = loanAmount / term;
        }

        // Format with commas for thousands
        const formattedPayment = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
        }).format(monthlyPayment);

        monthlyPaymentOutput.textContent = isNaN(monthlyPayment)
          ? "$0"
          : formattedPayment;
      }
    }

    // Add event listeners for financing calculator
    if (priceInput && downPaymentInput && termSelect && rateInput) {
      priceInput.addEventListener("input", calculateMonthlyPayment);
      downPaymentInput.addEventListener("input", calculateMonthlyPayment);
      termSelect.addEventListener("change", calculateMonthlyPayment);
      rateInput.addEventListener("input", calculateMonthlyPayment);

      // Initial calculation
      calculateMonthlyPayment();
    }

    // Make the calculateMonthlyPayment function available globally
    window.calculateMonthlyPayment = calculateMonthlyPayment;
  }

  // Initialize the financing calculator
  initFinancingCalculator();

  // Initialize the page with animations and smooth transitions
  setTimeout(() => {
    document.body.classList.add("loaded");

    // Trigger initial animations with faster transitions
    document
      .querySelectorAll(".hero-content, .circular-showcase")
      .forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = "translateY(0)";
        el.style.transition = "opacity 0.5s ease, transform 0.5s ease"; // Faster transition
      });

    // Start the circular showcase with a slight rotation
    const showcaseContainer = document.querySelector(".showcase-container");
    if (showcaseContainer) {
      showcaseContainer.style.animation = "rotateShowcase 30s linear infinite";
    }

    // Add counter animation to stats with faster counting
    const statNumbers = document.querySelectorAll(".stat-number");
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-count"));
      let count = 0;
      const duration = 1500; // 1.5 seconds (faster)
      const interval = Math.floor(duration / target);

      const counter = setInterval(() => {
        count += Math.ceil(target / 50); // Increment by larger steps
        stat.textContent = count > target ? target : count;

        if (count >= target) {
          clearInterval(counter);
          stat.textContent = target;
        }
      }, interval);
    });
  }, 300);

  // Add keyframe animation for showcase rotation
  const style = document.createElement("style");
  style.innerHTML = `
      @keyframes rotateShowcase {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }
    `;
  document.head.appendChild(style);

  // Add hover effects to all interactive elements
  const interactiveElements = document.querySelectorAll(
    ".cyber-btn, .category-card, .featured-card, .social-link"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      el.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    });
  });

  // Add smooth scroll behavior to all internal links with enhanced scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        // Scroll to top with smooth animation
        smoothScrollTo(0, 1000);
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Add highlight effect to target section
        targetElement.classList.add("highlight-section");

        // Scroll to target with offset for fixed header
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        // Use custom smooth scroll with adjustable duration
        smoothScrollTo(offsetPosition, 1000);

        // Remove highlight effect after animation
        setTimeout(() => {
          targetElement.classList.remove("highlight-section");
        }, 1200);
      }
    });
  });

  // Navigation active state
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", highlightNavLink);

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinksContainer = document.querySelector(".nav-links");
  const mobileNavLinks = document.querySelectorAll(".nav-link");

  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navLinksContainer.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Close mobile menu when a link is clicked
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        menuToggle.classList.remove("active");
        navLinksContainer.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });
  });

  // Close mobile menu when window is resized above mobile breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      menuToggle.classList.remove("active");
      navLinksContainer.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  // Form validation
  const contactForm = document.querySelector(".contact-form form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Simple validation
      let valid = true;
      const inputs = contactForm.querySelectorAll("input, textarea, select");

      inputs.forEach((input) => {
        if (!input.value.trim()) {
          valid = false;
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });

      if (valid) {
        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = "Sending...";

        setTimeout(() => {
          submitBtn.textContent = "Message Sent!";
          contactForm.reset();

          setTimeout(() => {
            submitBtn.innerHTML =
              '<span>Submit Inquiry</span><i class="cyber-icon fas fa-paper-plane"></i>';
          }, 3000);
        }, 2000);
      }
    });
  }

  // Newsletter form submission
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailInput = newsletterForm.querySelector('input[type="email"]');
      const submitBtn = newsletterForm.querySelector("button");

      if (emailInput.value.trim() === "") {
        emailInput.style.borderColor = "var(--primary)";
        return;
      }

      // Simulate form submission
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i>';
        emailInput.value = "";

        setTimeout(() => {
          submitBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
        }, 2000);
      }, 1500);
    });
  }

  // Performance optimizations for mobile
  const isMobile = window.innerWidth <= 992;

  // Adjust carousel settings for mobile
  if (isMobile) {
    // Reduce the radius for better mobile display
    const mobileRadius = 400;

    // Update the arrangeCards function for mobile
    const originalArrangeCards = arrangeCards;
    arrangeCards = function () {
      const angleStep = (2 * Math.PI) / totalCards;

      carCards.forEach((card, index) => {
        // Remove any active class first
        card.classList.remove("active");

        // Calculate the angle offset from the active card
        const angleOffset = ((index - activeIndex) * angleStep) % (2 * Math.PI);

        // Calculate position based on angle - simplified for mobile
        const x = mobileRadius * Math.sin(angleOffset) * 0.7;
        const z = mobileRadius * Math.cos(angleOffset) - mobileRadius;
        const rotateY = (angleOffset * 180) / Math.PI;

        // Apply transform with enhanced depth
        card.style.transform = `translate(-50%, -50%) rotateY(${rotateY}deg) translateZ(${z}px) translateX(${x}px)`;

        // Set z-index, opacity and scale based on position
        let distance = Math.abs(index - activeIndex);
        if (distance > totalCards / 2) {
          distance = totalCards - distance;
        }

        const zIndex = 10 - distance;
        const opacity = 1 - distance * 0.2; // Increased opacity for mobile
        const scale = 1 - distance * 0.1; // Reduced scale falloff for mobile

        card.style.zIndex = zIndex;
        card.style.opacity = opacity > 0.5 ? opacity : 0.5;
        card.style.scale = scale > 0.8 ? scale : 0.8;

        // Simplified transition for better performance on mobile
        card.style.transition = "all 0.3s ease";
        card.style.transitionDelay = "0s";
      });

      // Add active class to current card
      carCards[activeIndex].classList.add("active");
    };

    // Call arrangeCards to apply mobile optimizations
    arrangeCards();

    // Optimize parallax effect for mobile
    const originalScrollHandler = window.onscroll;
    window.onscroll = function () {
      // Throttle scroll events
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Simplified parallax for mobile
          if (lastScrollY <= window.innerHeight) {
            hero.style.backgroundPositionY = `${lastScrollY * 0.2}px`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    // Reduce animation complexity for mobile
    document.querySelectorAll(".glitch-text").forEach((el) => {
      el.classList.remove("glitch-text");
    });

    // Optimize stats counter for mobile
    const optimizedCounter = (stat) => {
      const target = parseInt(stat.getAttribute("data-count"));
      stat.textContent = target;
    };

    // Apply optimized counter to stats
    document.querySelectorAll(".stat-number").forEach(optimizedCounter);
  }

  // Handle orientation changes on mobile
  window.addEventListener("orientationchange", function () {
    // Small delay to allow the browser to complete the orientation change
    setTimeout(() => {
      // Recalculate viewport height for mobile browsers
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);

      // Refresh the carousel arrangement
      if (typeof arrangeCards === "function") {
        arrangeCards();
      }

      // Refresh the reveal animations
      if (typeof revealOnScroll === "function") {
        revealOnScroll();
      }

      // Close mobile menu if open
      const navLinksContainer = document.querySelector(".nav-links");
      const menuToggle = document.querySelector(".menu-toggle");
      if (navLinksContainer && navLinksContainer.classList.contains("active")) {
        navLinksContainer.classList.remove("active");
        if (menuToggle) {
          menuToggle.classList.remove("active");
        }
        document.body.classList.remove("menu-open");
      }
    }, 300);
  });

  // Set initial viewport height variable
  const setVhVariable = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  // Call on initial load
  setVhVariable();

  // Update on resize
  window.addEventListener("resize", () => {
    setVhVariable();
  });
});

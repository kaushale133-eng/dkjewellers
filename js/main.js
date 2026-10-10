/* ==========================================================================
   DK JEWELLERS - JAVASCRIPT INTERACTIONS
   Features:
   - Responsive Mobile Navigation Toggle
   - Automatic Promotional Banner Slider
   - Collection Sliders
   - Product Page Filter & Live Search
   - Quick View Product Modal
   - Contact Form Validation & Toast Notification
   - Back to Top Smooth Scroll
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initPromoSlider();
  initQuickViewModal();
  initProductFilter();
  initContactForm();
  initBackToTop();
});

/* --------------------------------------------------------------------------
   1. MOBILE NAVIGATION TOGGLE
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-toggle-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      }
    });

    // Close when clicking on a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
      });
    });
  }
}

/* --------------------------------------------------------------------------
   2. PROMOTIONAL BANNER SLIDER (Section 5.2)
   -------------------------------------------------------------------------- */
function initPromoSlider() {
  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide-item');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dots = document.querySelectorAll('.slider-dot');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const totalSlides = slides.length;
  let slideInterval = null;

  function updateSlider(index) {
    currentIndex = (index + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${(currentIndex * 100) / totalSlides}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(() => {
      updateSlider(currentIndex + 1);
    }, 5500);
  }

  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlider(currentIndex + 1);
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlider(currentIndex - 1);
      startAutoSlide();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateSlider(idx);
      startAutoSlide();
    });
  });

  // Pause on hover
  const sliderContainer = document.querySelector('.slider-container');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  // Start initial auto slide
  startAutoSlide();
}

/* --------------------------------------------------------------------------
   3. QUICK VIEW PRODUCT MODAL (Section 5.5)
   -------------------------------------------------------------------------- */
function initQuickViewModal() {
  const modalOverlay = document.getElementById('productQuickModal');
  if (!modalOverlay) return;

  const modalImg = modalOverlay.querySelector('.modal-img');
  const modalCat = modalOverlay.querySelector('.modal-cat-tag');
  const modalTitle = modalOverlay.querySelector('.modal-product-title');
  const modalPrice = modalOverlay.querySelector('.modal-price-tag');
  const modalDesc = modalOverlay.querySelector('.modal-desc');
  const modalMetal = modalOverlay.querySelector('.spec-metal');
  const modalPurity = modalOverlay.querySelector('.spec-purity');
  const modalWeight = modalOverlay.querySelector('.spec-weight');
  const modalWhatsAppBtn = modalOverlay.querySelector('.modal-whatsapp-link');
  const closeBtn = modalOverlay.querySelector('.modal-close-btn');

  function openModal(data) {
    if (modalImg) modalImg.src = data.img || '';
    if (modalImg) modalImg.alt = data.title || 'DK Jewellers Item';
    if (modalCat) modalCat.textContent = data.cat || 'Jewellery';
    if (modalTitle) modalTitle.textContent = data.title || '';
    if (modalPrice) modalPrice.textContent = data.price || 'Price on Consultation';
    if (modalDesc) modalDesc.textContent = data.desc || 'Handcrafted fine jewellery by DK Jewellers adhering to authentic purity standards.';
    if (modalMetal) modalMetal.textContent = data.metal || 'Gold / Silver';
    if (modalPurity) modalPurity.textContent = data.purity || 'BIS Hallmarked';
    if (modalWeight) modalWeight.textContent = data.weight || 'As per design';

    if (modalWhatsAppBtn) {
      const msg = encodeURIComponent(`Hello DK Jewellers, I am interested in "${data.title}" (${data.cat}, ${data.metal}). Please share more details.`);
      modalWhatsAppBtn.href = `https://wa.me/919198683121?text=${msg}`;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Delegate clicks on .btn-view-details
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-view-details');
    if (btn) {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (card) {
        const productData = {
          title: card.dataset.title || card.querySelector('.product-card-title')?.textContent.trim(),
          cat: card.dataset.category || card.querySelector('.product-category-name')?.textContent.trim(),
          metal: card.dataset.metal || '22K Gold',
          purity: card.dataset.purity || '916 BIS Hallmark',
          weight: card.dataset.weight || 'Available on request',
          price: card.dataset.price || card.querySelector('.product-price')?.textContent.trim(),
          desc: card.dataset.desc || card.querySelector('.product-meta-desc')?.textContent.trim(),
          img: card.dataset.img || card.querySelector('.product-card-img-wrap img')?.src
        };
        openModal(productData);
      }
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   4. PRODUCT PAGE FILTER & LIVE SEARCH (Section 6.2 & 6.3)
   -------------------------------------------------------------------------- */
function initProductFilter() {
  const catPills = document.querySelectorAll('.category-pill');
  const metalPills = document.querySelectorAll('.metal-pill');
  const searchInput = document.getElementById('productSearchInput');
  const productGrid = document.getElementById('productsGrid');
  const resultsCount = document.getElementById('resultsCount');

  if (!productGrid) return;

  const productCards = Array.from(productGrid.querySelectorAll('.product-card'));

  let activeCategory = 'all';
  let activeMetal = 'all';
  let searchTerm = '';

  function filterProducts() {
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardCat = (card.dataset.category || '').toLowerCase();
      const cardMetal = (card.dataset.metalType || '').toLowerCase();
      const cardTitle = (card.dataset.title || '').toLowerCase();
      const cardDesc = (card.dataset.desc || '').toLowerCase();

      const matchesCat = (activeCategory === 'all' || cardCat === activeCategory);
      const matchesMetal = (activeMetal === 'all' || cardMetal === activeMetal);
      const matchesSearch = (!searchTerm || cardTitle.includes(searchTerm) || cardCat.includes(searchTerm) || cardDesc.includes(searchTerm));

      if (matchesCat && matchesMetal && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (resultsCount) {
      resultsCount.textContent = `${visibleCount} item${visibleCount === 1 ? '' : 's'} displayed`;
    }

    const noResultsMsg = document.getElementById('noResultsMessage');
    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Category filter buttons
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = (pill.dataset.category || 'all').toLowerCase();
      filterProducts();
    });
  });

  // Metal filter buttons
  metalPills.forEach(pill => {
    pill.addEventListener('click', () => {
      metalPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeMetal = (pill.dataset.metal || 'all').toLowerCase();
      filterProducts();
    });
  });

  // Live search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      filterProducts();
    });
  }

  // Check URL parameter for initial category (e.g., product.html?cat=earrings)
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('cat');
  if (initialCat) {
    const targetPill = Array.from(catPills).find(p => p.dataset.category?.toLowerCase() === initialCat.toLowerCase());
    if (targetPill) {
      targetPill.click();
    }
  }
}

/* --------------------------------------------------------------------------
   5. CONTACT FORM VALIDATION & TOAST (Section 8.2 & 8.4)
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('dkjContactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim();
    const address = form.querySelector('[name="address"]')?.value.trim();
    const phone = form.querySelector('[name="phone"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !phone || !email || !message) {
      showToast('⚠️ Please complete all required fields.', 4000);
      return;
    }

    // Phone validation (simple digits check)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      showToast('⚠️ Please provide a valid 10-digit mobile number.', 4000);
      return;
    }

    // Construct inquiry confirmation and WhatsApp option
    showToast('✨ Thank you, ' + name + '! Your enquiry has been received. Our team will contact you shortly.', 6000);
    form.reset();
  });
}

function showToast(message, duration = 4000) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* --------------------------------------------------------------------------
   6. BACK TO TOP BUTTON
   -------------------------------------------------------------------------- */
function initBackToTop() {
  let btn = document.querySelector('.back-to-top');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = '▲';
    document.body.appendChild(btn);
  }

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

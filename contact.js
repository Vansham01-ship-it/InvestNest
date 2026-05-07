const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});


const revealEls = document.querySelectorAll(
  '.contact-eyebrow, .contact-title .line, .contact-sub, .contact-form-panel, .info-card'
);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));


const form = document.getElementById('contact-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.submit-btn');
  const originalText = btn.innerHTML;
  btn.innerHTML = 'Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.innerHTML = 'Message Sent!';
    btn.style.background = 'linear-gradient(135deg, var(--green), #5eead4)';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      btn.style.background = '';
      form.reset();
    }, 2000);
  }, 1500);
});
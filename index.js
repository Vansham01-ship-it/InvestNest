// ─── Particle Canvas ───────────────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 1.5 + 0.3,
    speedX: (Math.random() - 0.5) * 0.3,
    speedY: (Math.random() - 0.5) * 0.3,
    opacity: Math.random() * 0.5 + 0.1,
    color: Math.random() > 0.5 ? '201,168,76' : '79,142,247',
  };
}

function initParticles() {
  particles = Array.from({ length: 80 }, createParticle);
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
    ctx.fill();

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
  });

  // draw connections
  particles.forEach((a, i) => {
    particles.slice(i + 1).forEach(b => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(201,168,76,${0.05 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    });
  });

  animFrame = requestAnimationFrame(drawParticles);
}

resizeCanvas();
initParticles();
drawParticles();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });


// ─── Navbar Scroll ─────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
});


// ─── Intersection Observer — Reveal Animations ─────────────────────
const revealEls = document.querySelectorAll(
  '.hero-eyebrow, .hero-title .line, .hero-sub, .hero-cta, .role-card, .stat-item'
);

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => observer.observe(el));


// ─── Animated Counters ─────────────────────────────────────────────
function animateCounter(el, target, prefix = '', suffix = '', divide = 1) {
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 4);
    const current = target * ease / divide;

    const formatted = divide > 1
      ? current.toFixed(1)
      : Math.floor(current).toLocaleString('en-IN');

    el.textContent = prefix + formatted + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const item = entry.target;
      const counter = item.querySelector('.counter');
      const fill = item.querySelector('.stat-bar-fill');
      const target = parseInt(item.dataset.target);
      const prefix = item.dataset.prefix || '';
      const suffix = item.dataset.suffix || '';
      const divide = parseInt(item.dataset.divide) || 1;

      animateCounter(counter, target, prefix, suffix, divide);

      // stat bar widths are symbolic (max 100%)
      const pct = Math.min((target / 2400) * 100, 100);
      setTimeout(() => {
        fill.style.width = (pct > 20 ? pct : 20) + '%';
      }, 200);

      statObserver.unobserve(item);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-item').forEach(el => statObserver.observe(el));


// ─── Smooth hover tilt on role cards ──────────────────────────────
document.querySelectorAll('.role-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    card.style.transform = `translateY(-4px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.15s ease';
  });
});

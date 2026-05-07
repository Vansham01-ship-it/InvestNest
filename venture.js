// ─── Intersection Observer — Panels ────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.panel, .kpi-card').forEach(el => observer.observe(el));


// ─── Main Progress Bar ─────────────────────────────────────────────
const mainProgress = document.getElementById('main-progress');
const progressObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      mainProgress.style.width = '68%';
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
progressObserver.observe(mainProgress);


// ─── KPI Cards stagger ─────────────────────────────────────────────
document.querySelectorAll('.kpi-card').forEach((card, i) => {
  card.style.transitionDelay = (i * 80) + 'ms';
});


// ─── Bar Chart ─────────────────────────────────────────────────────
const chartData = [
  { month: 'Aug', val: 2.1 },
  { month: 'Sep', val: 2.8 },
  { month: 'Oct', val: 2.4 },
  { month: 'Nov', val: 3.9 },
  { month: 'Dec', val: 5.2 },
  { month: 'Jan', val: 6.1 },
  { month: 'Feb', val: 4.8 },
  { month: 'Mar', val: 8.0 },
];

const maxVal = Math.max(...chartData.map(d => d.val));
const wrap = document.getElementById('bar-chart');

chartData.forEach((d, i) => {
  const pct = (d.val / maxVal) * 100;
  const col = document.createElement('div');
  col.className = 'bar-col';
  col.innerHTML = `
    <div class="bar-inner${i === chartData.length - 1 ? ' highlight' : ''}" style="height:0%">
      <span class="bar-val">${d.val}</span>
    </div>
    <div class="bar-month">${d.month}</div>
  `;
  wrap.appendChild(col);

  // Animate in with stagger
  const bar = col.querySelector('.bar-inner');
  setTimeout(() => {
    bar.style.height = pct + '%';
  }, 300 + i * 80);
});


// ─── Investor items stagger ────────────────────────────────────────
const invItems = document.querySelectorAll('.inv-item');
const invObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      invObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

invItems.forEach(el => invObserver.observe(el));


// ─── Milestone items stagger ───────────────────────────────────────
const msItems = document.querySelectorAll('.ms-item');
const msObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      msObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

msItems.forEach(el => msObserver.observe(el));


// ─── Donut Chart (Canvas) ──────────────────────────────────────────
const canvas = document.getElementById('donut-canvas');
const ctx = canvas.getContext('2d');

const slices = [
  { label: 'Founders',    value: 60.4, color: '#2dd4a0' },
  { label: 'Inst. VC',    value: 23.7, color: '#4f8ef7' },
  { label: 'ESOP',        value: 8.0,  color: '#c9a84c' },
  { label: 'Angels',      value: 7.9,  color: '#f43f5e' },
];

const total = slices.reduce((s, d) => s + d.value, 0);
const cx = 90, cy = 90, r = 72, inner = 50;
let animProgress = 0;

function drawDonut(progress) {
  ctx.clearRect(0, 0, 180, 180);
  let startAngle = -Math.PI / 2;

  slices.forEach(slice => {
    const sweep = (slice.value / total) * Math.PI * 2 * progress;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + sweep);
    ctx.closePath();
    ctx.fillStyle = slice.color;
    ctx.fill();
    startAngle += sweep;
  });

  // Inner cutout
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#13131f';
  ctx.fill();
}

function animateDonut() {
  animProgress += 0.025;
  if (animProgress > 1) animProgress = 1;
  drawDonut(animProgress);
  if (animProgress < 1) requestAnimationFrame(animateDonut);
}

const donutObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      requestAnimationFrame(animateDonut);
      donutObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

donutObserver.observe(canvas);

// Tooltip on hover
canvas.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const dx = mx - cx, dy = my - cy;
  const dist = Math.sqrt(dx*dx + dy*dy);

  if (dist > inner && dist < r) {
    let angle = Math.atan2(dy, dx) + Math.PI / 2;
    if (angle < 0) angle += Math.PI * 2;

    let cumAngle = 0;
    let hovered = null;
    for (const s of slices) {
      const sa = (s.value / total) * Math.PI * 2;
      if (angle >= cumAngle && angle < cumAngle + sa) {
        hovered = s;
        break;
      }
      cumAngle += sa;
    }

    canvas.title = hovered ? `${hovered.label}: ${hovered.value}%` : '';
  } else {
    canvas.title = '';
  }
});

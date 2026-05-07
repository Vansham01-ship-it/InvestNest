const cards = document.querySelectorAll('.company-card');

const cardObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        const fill = entry.target.querySelector('.progress-fill');
        if (fill) {
          const w = getComputedStyle(fill).getPropertyValue('--w');
          fill.style.width = w;
        }
      }, Array.from(cards).indexOf(entry.target) * 80);
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

cards.forEach(c => cardObserver.observe(c));


const pills = document.querySelectorAll('.pill');
const searchInput = document.getElementById('search-input');
const noResults = document.getElementById('no-results');
let activeFilter = 'all';

function applyFilters() {
  const q = searchInput.value.toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    const sector = card.dataset.sector;
    const name = card.querySelector('.co-name').textContent.toLowerCase();
    const desc = card.querySelector('.co-desc').textContent.toLowerCase();

    const matchesSector = activeFilter === 'all' || sector === activeFilter;
    const matchesSearch = !q || name.includes(q) || desc.includes(q) || sector.toLowerCase().includes(q);

    if (matchesSector && matchesSearch) {
      card.style.display = '';
      visible++;
    } else {
      card.style.display = 'none';
    }
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
}

pills.forEach(pill => {
  pill.addEventListener('click', () => {
    pills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    applyFilters();
  });
});

searchInput.addEventListener('input', applyFilters);


const overlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const steps = [
  document.getElementById('step-1'),
  document.getElementById('step-2'),
  document.getElementById('step-3'),
  document.getElementById('step-4'),
];
const dots = document.querySelectorAll('.sdot');
let currentStep = 0;
let selectedAmount = null;
let selectedCompany = {};

function openModal(data) {
  selectedCompany = data;
  document.getElementById('ms-company').textContent = data.company;
  document.getElementById('ms-sector').textContent = data.sector;
  document.getElementById('ms-valuation').textContent = data.valuation;
  document.getElementById('ms-target').textContent = data.target;
  document.getElementById('ms-raised').textContent = data.raised;

  goToStep(0);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function goToStep(n) {
  steps.forEach((s, i) => s.classList.toggle('hidden', i !== n));
  dots.forEach((d, i) => d.classList.toggle('active', i === n));
  currentStep = n;
}

document.querySelectorAll('.invest-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    openModal({
      company: btn.dataset.company,
      valuation: btn.dataset.valuation,
      target: btn.dataset.target,
      raised: btn.dataset.raised,
      sector: btn.dataset.sector,
    });
  });
});

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

document.querySelectorAll('.preset').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const val = btn.dataset.val;
    document.getElementById('amount-input').value = val;
    updateAmountHint(val);
  });
});

const amountInput = document.getElementById('amount-input');
amountInput.addEventListener('input', () => {
  document.querySelectorAll('.preset').forEach(b => b.classList.remove('selected'));
  updateAmountHint(amountInput.value);
});

function updateAmountHint(val) {
  const hint = document.getElementById('amount-hint');
  const n = parseFloat(val);
  if (!val || isNaN(n) || n <= 0) { hint.textContent = ''; return; }
  if (n >= 100) {
    hint.textContent = `= ₹${(n / 100).toFixed(2)} Crore`;
  } else {
    hint.textContent = `= ₹${n} Lakhs`;
  }
}

document.getElementById('step1-next').addEventListener('click', () => {
  const val = parseFloat(amountInput.value);
  if (!val || val <= 0) {
    amountInput.style.borderColor = '#f43f5e';
    amountInput.focus();
    setTimeout(() => amountInput.style.borderColor = '', 1500);
    return;
  }
  selectedAmount = val;
  goToStep(1);
});

document.getElementById('step2-next').addEventListener('click', () => {
  const label = selectedAmount >= 100
    ? `₹${(selectedAmount / 100).toFixed(2)} Crore`
    : `₹${selectedAmount} Lakhs`;
  document.getElementById('pad-value').textContent = label;

  const ref = 'IN-2025-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  document.getElementById('neft-ref').textContent = ref;
  document.getElementById('success-ref').textContent = 'Reference: ' + ref;

  goToStep(2);
});

document.getElementById('step2-back').addEventListener('click', () => goToStep(0));
document.getElementById('step3-back').addEventListener('click', () => goToStep(1));

document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.payment-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('panel-' + tab.dataset.tab).classList.remove('hidden');
  });
});

const cardNum = document.getElementById('card-num');
if (cardNum) {
  cardNum.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').substring(0, 16);
    e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
  });
}

function triggerSuccess() {
  document.getElementById('success-msg').textContent =
    `Your ₹${selectedAmount} Lakhs commitment to ${selectedCompany.company} has been registered. Confirmation will be sent to your email within 24 hours.`;
  goToStep(3);
}

document.getElementById('pay-upi-btn').addEventListener('click', () => {
  simulateLoading('pay-upi-btn', triggerSuccess);
});
document.getElementById('pay-neft-btn').addEventListener('click', triggerSuccess);
document.getElementById('pay-card-btn').addEventListener('click', () => {
  simulateLoading('pay-card-btn', triggerSuccess);
});

function simulateLoading(btnId, cb) {
  const btn = document.getElementById(btnId);
  const original = btn.textContent;
  btn.textContent = 'Processing...';
  btn.disabled = true;
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    btn.style.opacity = '1';
    cb();
  }, 1800);
}

document.getElementById('success-close').addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
});

const deal = JSON.parse(sessionStorage.getItem('investDeal') || '{}');

if (!deal.company) {

  window.location.href = 'investor.html';
}


document.getElementById('deal-company').textContent = deal.company;
document.getElementById('deal-sector').textContent = deal.sector;
document.getElementById('deal-valuation').textContent = deal.valuation;
document.getElementById('deal-target').textContent = deal.target;
document.getElementById('deal-raised').textContent = deal.raised;

let currentStep = 1;
let selectedAmount = 0;
let referenceCode = '';

function showStep(n) {

  document.querySelectorAll('.step-section').forEach((s) => s.classList.remove('active'));

  document.getElementById('step-' + n).classList.add('active');
  currentStep = n;

 
  document.querySelectorAll('.sp-dot').forEach((dot, i) => {
    const stepNum = i + 1;
    dot.classList.remove('active', 'done');
    if (stepNum < n) dot.classList.add('done');
    if (stepNum === n) dot.classList.add('active');
  });

  document.querySelectorAll('.sp-line').forEach((line, i) => {
    line.classList.toggle('done', i < n - 1);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const amountInput = document.getElementById('amount-input');
const amountHint = document.getElementById('amount-hint');


document.querySelectorAll('.preset').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preset').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    amountInput.value = btn.dataset.val;
    updateHint(btn.dataset.val);
  });
});


amountInput.addEventListener('input', () => {
  document.querySelectorAll('.preset').forEach((b) => b.classList.remove('selected'));
  updateHint(amountInput.value);
});

function updateHint(val) {
  const n = parseFloat(val);
  if (!val || isNaN(n) || n <= 0) {
    amountHint.textContent = '';
    return;
  }
  amountHint.textContent = n >= 100 ? `= ₹${(n / 100).toFixed(2)} Crore` : `= ₹${n} Lakhs`;
}

document.getElementById('btn-step1').addEventListener('click', () => {
  const val = parseFloat(amountInput.value);
  if (!val || val < 5) {
    amountInput.style.borderColor = 'var(--red)';
    amountInput.focus();
    setTimeout(() => (amountInput.style.borderColor = ''), 1500);
    return;
  }
  selectedAmount = val;
  showStep(2);
});

document.getElementById('btn-back2').addEventListener('click', () => showStep(1));

document.getElementById('btn-step2').addEventListener('click', () => {
  // Basic validation
  const name = document.getElementById('inv-name').value.trim();
  const email = document.getElementById('inv-email').value.trim();
  if (!name || !email) {
    alert('Please fill in your name and email.');
    return;
  }

  referenceCode = 'IN-2025-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  document.getElementById('neft-ref').textContent = referenceCode;

  const label = selectedAmount >= 100
    ? `₹${(selectedAmount / 100).toFixed(2)} Crore`
    : `₹${selectedAmount} Lakhs`;
  document.getElementById('pad-value').textContent = label;

  showStep(3);
});

document.getElementById('btn-back3').addEventListener('click', () => showStep(2));

document.querySelectorAll('.ptab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.payment-panel').forEach((p) => p.classList.remove('active'));
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

document.getElementById('card-num').addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '').substring(0, 16);
  e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
});

function finish() {
  document.getElementById('success-msg').textContent =
    `Your ₹${selectedAmount} Lakhs commitment to ${deal.company} has been registered. Confirmation will be sent to your email within 24 hours.`;
  document.getElementById('success-ref').textContent = 'Reference: ' + referenceCode;
  showStep(4);
}

function withLoading(btnId, callback) {
  const btn = document.getElementById(btnId);
  const original = btn.textContent;
  btn.textContent = 'Processing...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = original;
    btn.disabled = false;
    callback();
  }, 1800);
}

document.getElementById('pay-upi').addEventListener('click', () => withLoading('pay-upi', finish));
document.getElementById('pay-neft').addEventListener('click', finish);
document.getElementById('pay-card').addEventListener('click', () => withLoading('pay-card', finish));

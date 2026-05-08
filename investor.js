/* ─── Investor Listing Page ─── */

// 1. Card reveal animation
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const fill = entry.target.querySelector('.progress-fill');
      if (fill) fill.style.width = getComputedStyle(fill).getPropertyValue('--w');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.company-card').forEach((c) => cardObserver.observe(c));

// 2. Filtering
const pills = document.querySelectorAll('.pill');
const searchInput = document.getElementById('search-input');
const cards = document.querySelectorAll('.company-card');
const noResults = document.getElementById('no-results');
let activeFilter = 'all';

function applyFilters() {
  const q = searchInput.value.toLowerCase().trim();
  let visible = 0;

  cards.forEach((card) => {
    const sector = card.dataset.sector;
    const text = card.textContent.toLowerCase();
    const matchesSector = activeFilter === 'all' || sector === activeFilter;
    const matchesSearch = !q || text.includes(q);

    card.style.display = matchesSector && matchesSearch ? '' : 'none';
    if (matchesSector && matchesSearch) visible++;
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
}

pills.forEach((pill) =>
  pill.addEventListener('click', () => {
    pills.forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    applyFilters();
  })
);

searchInput.addEventListener('input', applyFilters);

// 3. Invest Now → save to sessionStorage & go to invest.html
document.querySelectorAll('.invest-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const data = {
      company: btn.dataset.company,
      valuation: btn.dataset.valuation,
      target: btn.dataset.target,
      raised: btn.dataset.raised,
      sector: btn.dataset.sector,
    };
    sessionStorage.setItem('investDeal', JSON.stringify(data));
    window.location.href = 'invest.html';
  });
});

const defaultDeals = [
  { title: "iPhone 11 Unlocked", price: "$120", note: "1 Day Only • First Come, First Served" },
  { title: "PS5 / Xbox HDMI Repair", price: "$70", note: "Fast repair at Mega Wireless" },
  { title: "Tempered Glass", price: "Free", note: "With select screen repairs" }
];

const plans = [
  {
    carrier: "MobileX",
    price: "$20/mo",
    features: ["Unlimited Talk", "Unlimited Text", "10GB High-Speed Data", "+$5 International Calling"]
  },
  {
    carrier: "Ultra Mobile",
    price: "Ask in store",
    features: ["Prepaid service", "International options", "Bring your own phone"]
  },
  {
    carrier: "Lyca Mobile",
    price: "Ask in store",
    features: ["Talk, text, data", "International calling", "Fast activation"]
  }
];

const deals = JSON.parse(localStorage.getItem("megaDeals") || "null") || defaultDeals;

function renderDeals() {
  const grid = document.getElementById("dealsGrid");
  grid.innerHTML = deals.map(deal => `
    <article class="deal-card reveal">
      <h3>${deal.title}</h3>
      <strong>${deal.price}</strong>
      <p>${deal.note}</p>
    </article>
  `).join("");
}

function renderPlans() {
  const grid = document.getElementById("plansGrid");
  grid.innerHTML = plans.map(plan => `
    <article class="plan-card reveal">
      <h3>${plan.carrier}</h3>
      <div class="price">${plan.price}</div>
      <ul>${plan.features.map(item => `<li>${item}</li>`).join("")}</ul>
      <a class="btn primary" href="tel:6156785849">Activate Now</a>
    </article>
  `).join("");
}

document.getElementById("menuBtn")?.addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});

renderDeals();
renderPlans();

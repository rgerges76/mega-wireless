const form = document.getElementById("dealForm");
const box = document.getElementById("adminDeals");

function getDeals() {
  return JSON.parse(localStorage.getItem("megaDeals") || "[]");
}

function saveDeals(deals) {
  localStorage.setItem("megaDeals", JSON.stringify(deals));
}

function render() {
  const deals = getDeals();
  box.innerHTML = deals.length ? deals.map((d, i) => `
    <div class="admin-deal">
      <strong>${d.title}</strong><br>
      ${d.price}<br>
      ${d.note}<br>
      <button onclick="removeDeal(${i})">Remove</button>
    </div>
  `).join("") : "<p>No custom deals yet.</p>";
}

window.removeDeal = function(index) {
  const deals = getDeals();
  deals.splice(index, 1);
  saveDeals(deals);
  render();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const deals = getDeals();
  deals.push({
    title: document.getElementById("dealTitle").value,
    price: document.getElementById("dealPrice").value,
    note: document.getElementById("dealNote").value
  });
  saveDeals(deals);
  form.reset();
  render();
});

render();

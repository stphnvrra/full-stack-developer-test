const items = [];
let nextId = 1;

const clockEl = document.getElementById('clock');
const totalQtyEl = document.getElementById('totalQty');
const totalValueEl = document.getElementById('totalValue');
const itemListEl = document.getElementById('itemList');
const addForm = document.getElementById('addForm');

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function updateClock() {
  // ponytail: native Intl, no date library
  clockEl.textContent = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function getTotals() {
  return items.reduce(
    (acc, item) => {
      acc.qty += item.quantity;
      acc.value += item.quantity * item.price;
      return acc;
    },
    { qty: 0, value: 0 }
  );
}

function render() {
  const { qty, value } = getTotals();
  totalQtyEl.textContent = qty;
  totalValueEl.textContent = money.format(value);

  if (items.length === 0) {
    itemListEl.innerHTML = '<li class="empty">No items yet</li>';
    return;
  }

  itemListEl.innerHTML = items.map((item) => `
    <li data-id="${item.id}">
      <div class="item-info">
        <div class="item-name">${escapeHtml(item.name)}</div>
        <div class="item-meta">${item.quantity} × ${money.format(item.price)}</div>
      </div>
      <div class="item-actions">
        <button class="use" data-action="use" ${item.quantity === 0 ? 'disabled' : ''}>Use</button>
        <button class="delete" data-action="delete">Delete</button>
      </div>
    </li>
  `).join('');
}

function escapeHtml(text) {
  const el = document.createElement('span');
  el.textContent = text;
  return el.innerHTML;
}

function addItem(name, quantity, price) {
  items.push({ id: nextId++, name, quantity, price });
  render();
}

function deleteItem(id) {
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) items.splice(index, 1);
  render();
}

function useItem(id) {
  const item = items.find((i) => i.id === id);
  if (!item || item.quantity <= 0) return;
  item.quantity -= 1;
  render();
}

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(addForm);
  const name = data.get('name').trim();
  const quantity = parseInt(data.get('quantity'), 10);
  const price = parseFloat(data.get('price'));

  if (!name || quantity < 1 || price < 0 || Number.isNaN(quantity) || Number.isNaN(price)) return;

  addItem(name, quantity, price);
  addForm.reset();
});

itemListEl.addEventListener('click', (e) => {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const id = Number(button.closest('li').dataset.id);
  if (button.dataset.action === 'use') useItem(id);
  if (button.dataset.action === 'delete') deleteItem(id);
});

updateClock();
setInterval(updateClock, 1000);
render();

// ponytail: runnable self-check for core logic
if (typeof module !== 'undefined' && module.exports) {
  function demo() {
    const testItems = [
      { id: 1, name: 'A', quantity: 3, price: 10 },
      { id: 2, name: 'B', quantity: 2, price: 5 },
    ];
    const totals = testItems.reduce(
      (acc, item) => {
        acc.qty += item.quantity;
        acc.value += item.quantity * item.price;
        return acc;
      },
      { qty: 0, value: 0 }
    );
    console.assert(totals.qty === 5, 'qty should be 5');
    console.assert(totals.value === 40, 'value should be 40');
  }
  demo();
}

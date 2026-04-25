let data = JSON.parse(localStorage.getItem("data")) || [];

// Set role (change manually for testing)
if (!localStorage.getItem("role")) {
  localStorage.setItem("role", "admin"); // or "user"
}

function isAdmin() {
  return localStorage.getItem("role") === "admin";
}

// On page load
window.onload = function () {
  controlUI();
  loadDashboard();
  loadTable();
};

// Hide add button if user
function controlUI() {
  let btn = document.getElementById("addBtn");
  if (btn && !isAdmin()) {
    btn.style.display = "none";
  }
}

// MODAL
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

// ADD TRANSACTION
function addTransaction() {
  let desc = document.getElementById("desc").value.trim();
  let amount = document.getElementById("amount").value;
  let type = document.getElementById("type").value;

  if (!desc || !amount) {
    alert("Please fill all fields");
    return;
  }

  let transaction = {
    desc,
    amount: Number(amount),
    type,
    date: new Date().toLocaleDateString()
  };

  data.push(transaction);

  localStorage.setItem("data", JSON.stringify(data));

  closeModal();
  location.reload();
}

// DASHBOARD
function loadDashboard() {
  let income = 0, expense = 0;
  let list = document.getElementById("list");

  if (!list) return;

  list.innerHTML = "";

  data.forEach(item => {
    if (item.type === "income") income += item.amount;
    else expense += item.amount;

    let li = document.createElement("li");
    li.innerHTML = `
      ${item.desc} - ₹${item.amount}
      <small>(${item.type})</small>
    `;
    list.appendChild(li);
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("savings").innerText = income - expense;
}

// TRANSACTION TABLE
function loadTable() {
  let body = document.getElementById("tableBody");
  if (!body) return;

  body.innerHTML = "";

  data.forEach((item, index) => {
    let row = `
      <tr>
        <td>${item.desc}</td>
        <td>₹${item.amount}</td>
        <td>${item.type}</td>
        <td>
          ${isAdmin() ? `<button class="delete-btn" onclick="deleteItem(${index})">Delete</button>` : "View"}
        </td>
      </tr>
    `;
    body.innerHTML += row;
  });
}

// DELETE
function deleteItem(index) {
  if (!confirm("Delete this transaction?")) return;

  data.splice(index, 1);
  localStorage.setItem("data", JSON.stringify(data));
  location.reload();
}
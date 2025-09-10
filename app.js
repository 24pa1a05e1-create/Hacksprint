// Simple auth logic using localStorage for demo
let USERS = JSON.parse(localStorage.getItem('USERS') || '{}');
let EXPENSES = {};

document.getElementById('login-form').onsubmit = function(e) {
  e.preventDefault();
  let u = loginUsername.value, p = loginPassword.value;
  if (USERS[u] && USERS[u].password === p) {
    localStorage.setItem('CUR_USER', u);
    loadDashboard(u);
  } else {
    alert('Invalid credentials!');
  }
};

document.getElementById('signup-form').onsubmit = function(e) {
  e.preventDefault();
  let name = signupName.value, u = signupUsername.value, p = signupPassword.value, phone = signupPhone.value;
  if (!USERS[u]) {
    USERS[u] = {name, password: p, phone};
    localStorage.setItem('USERS', JSON.stringify(USERS));
    alert('Account created! Please login.');
  } else {
    alert('Username exists!');
  }
};

function loadDashboard(user) {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('dashboard-section').style.display = '';
  document.getElementById('user-name').textContent = USERS[user].name;
  loadExpenses(user);
}

document.getElementById('farm-info-form').onsubmit = function(e) {
  e.preventDefault();
  USERS[localStorage.getItem('CUR_USER')].acres = farmAcres.value;
  USERS[localStorage.getItem('CUR_USER')].season = farmSeason.value;
  localStorage.setItem('USERS', JSON.stringify(USERS));
  alert('Farm info saved.');
};

window.showTask = function(task) {
  let acres = USERS[localStorage.getItem('CUR_USER')].acres || 1;
  let phone = USERS[localStorage.getItem('CUR_USER')].phone;
  let section = document.getElementById('task-section');
  if (task === 'seeding') {
    // Assume rates for prototype
    let seed = acres * 25, fert = acres * 10, labor = acres * 40;
    section.innerHTML = `<img src="images/seeding.png" width="200">
      <p>Seed Estimation: ${seed}kg (₹${seed*200})</p>
      <p>Fertilizer: ${fert}kg (₹${fert*80})</p>
      <p>Labor: ₹${labor*300}</p>
      <button onclick="addExpense(${seed*200 + fert*80 + labor*300},'Seeding')">Add Expense</button>
      <button onclick="notifyUser('Time to seed your field!')">Send Reminder SMS</button>`;
  }
  else if (task === 'watering') {
    let water = acres * 3500;
    section.innerHTML = `<img src="images/watering.png" width="200">
      <p>Water needed: ${water} litres</p>
      <button onclick="addExpense(2000,'Water Pump')">Add Pump Expense (₹2000)</button>
      <button onclick="notifyUser('Time to irrigate your field!')">Send Reminder SMS</button>`;
  }
  else if (task === 'harvesting') {
    let thresh = acres * 1000;
    section.innerHTML = `<img src="images/harvesting.png" width="200">
      <p>Threshing time: ${acres*2} hrs | Machine Cost: ₹${thresh}</p>
      <button onclick="addExpense(${thresh},'Threshing')">Add Expense</button>
      <button onclick="notifyUser('It\'s harvesting time!')">Send Reminder SMS</button>`;
  }
};

window.addExpense = function(amount, type) {
  let user = localStorage.getItem('CUR_USER');
  if (!EXPENSES[user]) EXPENSES[user] = [];
  EXPENSES[user].push({type, amount});
  localStorage.setItem('EXPENSES', JSON.stringify(EXPENSES));
  loadExpenses(user);
};

function loadExpenses(user) {
  EXPENSES = JSON.parse(localStorage.getItem('EXPENSES') || '{}');
  let list = EXPENSES[user]||[], html = '', total = 0;
  list.forEach(e => {
    html += `<li>${e.type}: ₹${e.amount}</li>`;
    total += Number(e.amount);
  });
  document.getElementById('expense-list').innerHTML = html;
  document.getElementById('total-expense').textContent = total;
}

window.notifyUser = function(message) {
  alert("In live demo, this will send SMS: " + message);
  // For real SMS: send AJAX POST to backend server.js endpoint that triggers Twilio SMS
};

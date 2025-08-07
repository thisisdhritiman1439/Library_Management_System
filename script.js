// Toggle login/signup section
function toggleSection(section) {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("signup-section").classList.add("hidden");
  document.getElementById("dashboard-section").classList.add("hidden");

  if (section === "login") {
    document.getElementById("login-section").classList.remove("hidden");
  } else if (section === "signup") {
    document.getElementById("signup-section").classList.remove("hidden");
  } else {
    document.getElementById("dashboard-section").classList.remove("hidden");
  }
}

// Sign up logic
document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const mobile = document.getElementById("signupMobile").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const role = document.getElementById("signupRole").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.email === email)) {
    alert("User already exists!");
    return;
  }

  users.push({ name, mobile, email, password, role });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created! Please login.");
  toggleSection("login");
});

// Login logic
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Invalid credentials!");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  showDashboard(user);
});

// Show dashboard based on role
function showDashboard(user) {
  document.getElementById("userName").innerText = user.name;
  document.getElementById("userRole").innerText = user.role;

  document.getElementById("librarianPanel").classList.add("hidden");
  document.getElementById("studentPanel").classList.add("hidden");
  document.getElementById("otherPanel").classList.add("hidden");

  if (user.role === "Librarian") {
    document.getElementById("librarianPanel").classList.remove("hidden");
  } else if (user.role === "Student") {
    document.getElementById("studentPanel").classList.remove("hidden");
  } else {
    document.getElementById("otherPanel").classList.remove("hidden");
  }

  toggleSection("dashboard");
}

// Logout
function logout() {
  localStorage.removeItem("currentUser");
  toggleSection("login");
}

// Auto-login if already signed in
window.onload = function () {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) {
    showDashboard(user);
  }
};

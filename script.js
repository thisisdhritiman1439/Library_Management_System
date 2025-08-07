function signup() {
  const name = document.getElementById('signup-name').value.trim();
  const mobile = document.getElementById('signup-mobile').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value.trim();
  const role = document.getElementById('signup-role').value;

  if (!name || !mobile || !email || !password) {
    alert("Please fill in all sign-up fields.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  if (users.find(user => user.email === email)) {
    alert("User already exists!");
    return;
  }

  users.push({ name, mobile, email, password, role });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created successfully. You can now log in.");
}

function login() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    alert("Invalid login credentials.");
    return;
  }

  localStorage.setItem("currentUser", JSON.stringify(user));
  showLibraryPage(user);
}

function showLibraryPage(user) {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('library-section').style.display = 'block';

  document.getElementById('welcome-text').innerText = `Hello ${user.name} (${user.role})`;

  if (user.role === "Librarian") {
    document.getElementById('librarian-panel').style.display = 'block';
  } else {
    document.getElementById('librarian-panel').style.display = 'none';
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  document.getElementById('auth-section').style.display = 'block';
  document.getElementById('library-section').style.display = 'none';
}

// Auto-login if already signed in
window.onload = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  if (user) showLibraryPage(user);
};

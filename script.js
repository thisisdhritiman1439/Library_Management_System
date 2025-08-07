document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(
    (user) => user.email === email && user.password === password && user.role === role
  );

  if (foundUser) {
    alert(`Welcome back, ${foundUser.name} (${foundUser.role})!`);
    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    window.location.href = "library.html"; // Redirect to library main page
  } else {
    alert("Invalid email, password, or role. Please try again.");
  }
});

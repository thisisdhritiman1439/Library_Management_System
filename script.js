// JavaScript for Library Management System

let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
let books = [];
let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || {};

async function loadBooks() {
  const res = await fetch("books.json");
  books = await res.json();
  displayBooks();
  displayFavorites();
  displayIssuedBooks();
  recommendBooks();
}

function signup() {
  const name = document.getElementById("auth-name").value;
  const mobile = document.getElementById("auth-mobile").value;
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;
  const role = document.getElementById("auth-role").value;

  if (users.find(user => user.email === email)) return alert("User already exists!");

  const newUser = { name, mobile, email, password, role };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  alert("Account created! Please log in.");
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return alert("Invalid login!");
  currentUser = user;
  localStorage.setItem("currentUser", JSON.stringify(user));
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("welcome").innerText = `Welcome, ${user.name} (${user.role})`;
  if (user.role === 'librarian') document.getElementById("add-book-section").style.display = 'block';
  loadBooks();
}

function logout() {
  currentUser = null;
  localStorage.removeItem("currentUser");
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("dashboard").style.display = "none";
}

function displayBooks() {
  const container = document.getElementById("books-list");
  container.innerHTML = "<h3>All Books</h3>";
  books.forEach((book, index) => {
    container.innerHTML += `
    <div class="book-card">
      <img src="${book.cover}" alt="Cover">
      <div class="book-info">
        <h4>${book.title}</h4>
        <p><strong>Author:</strong> ${book.author}</p>
        <p>${book.description}</p>
        <button onclick="viewIndex(${index})">View Index</button>
        ${currentUser.role !== 'librarian' ? `<button onclick="addToFavorites(${index})">Add to My List</button>` : ''}
        ${currentUser.role === 'librarian' ? `<button onclick="deleteBook(${index})">Delete</button>` : ''}
      </div>
    </div>
    `;
  });
}

function addBook() {
  const title = document.getElementById("book-title").value;
  const author = document.getElementById("book-author").value;
  const cover = document.getElementById("book-cover").value;
  const description = document.getElementById("book-description").value;
  const index = document.getElementById("book-index").value;
  books.push({ title, author, cover, description, index });
  alert("Book added!");
  displayBooks();
}

function deleteBook(i) {
  if (confirm("Are you sure you want to delete this book?")) {
    books.splice(i, 1);
    displayBooks();
  }
}

function addToFavorites(index) {
  if (!favorites[currentUser.email]) favorites[currentUser.email] = [];
  const book = books[index];
  if (!favorites[currentUser.email].includes(book.title)) {
    favorites[currentUser.email].push(book.title);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to your book list!");
    displayFavorites();
  }
}

function displayFavorites() {
  const favDiv = document.getElementById("my-books");
  const favs = favorites[currentUser.email] || [];
  favDiv.innerHTML = `<h3>My Book List</h3>`;
  favs.forEach(title => {
    const book = books.find(b => b.title === title);
    if (book) {
      favDiv.innerHTML += `<div><b>${book.title}</b> <button onclick="issueBook('${book.title}')">Issue</button></div>`;
    }
  });
}

function issueBook(title) {
  const issueDate = new Date();
  const returnDate = new Date();
  returnDate.setDate(issueDate.getDate() + 7);
  issuedBooks.push({ user: currentUser.email, title, issueDate, returnDate });
  localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
  alert("Book Issued!");
  displayIssuedBooks();
}

function displayIssuedBooks() {
  const div = document.getElementById("issued-books");
  div.innerHTML = `<h3>Issued Books</h3>`;
  const myIssues = issuedBooks.filter(i => i.user === currentUser.email);
  myIssues.forEach(i => {
    const daysLeft = Math.ceil((new Date(i.returnDate) - new Date()) / (1000 * 60 * 60 * 24));
    div.innerHTML += `<div>${i.title} - Return in ${daysLeft} days <button onclick="returnBook('${i.title}')">Return</button></div>`;
  });
}

function returnBook(title) {
  issuedBooks = issuedBooks.filter(i => !(i.title === title && i.user === currentUser.email));
  localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
  alert("Book Returned!");
  displayIssuedBooks();
}

function viewIndex(index) {
  alert(`Index: \n${books[index].index}`);
}

function recommendBooks() {
  const section = document.getElementById("recommendation-section");
  const myIssues = issuedBooks.filter(i => i.user === currentUser.email);
  if (myIssues.length === 0) {
    section.innerHTML = "";
    return;
  }
  const lastTitle = myIssues[myIssues.length - 1].title;
  const lastBook = books.find(b => b.title === lastTitle);
  if (!lastBook) return;
  const keyword = lastBook.title.split(" ")[0];
  const related = books.filter(b => b.title.includes(keyword) && b.title !== lastTitle);
  section.innerHTML = `<h3>Recommended Books based on '${lastTitle}'</h3>`;
  related.forEach(b => {
    section.innerHTML += `<div><b>${b.title}</b> by ${b.author}</div>`;
  });
}

// Auto-login if session exists
if (currentUser) {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("welcome").innerText = `Welcome, ${currentUser.name} (${currentUser.role})`;
  if (currentUser.role === 'librarian') document.getElementById("add-book-section").style.display = 'block';
  loadBooks();
}

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Sample book data
const books = [
  {
    ISBN: "123456",
    Title: "Hi Book 1",
    Author: "John Doe",
    Reviews: ["best book of the year", {}],
  },
  { ISBN: "456", Title: " Journey to Death", Author: "John Doe", Reviews: [] },
  { ISBN: "789012", Title: "Physics ", Author: "Jane Doe", Reviews: [] },
  { ISBN: "34", Title: "Chemistry Book 3", Author: "Michel", Reviews: [] },
  { ISBN: "789", Title: "Math Book 4", Author: "Will", Reviews: [] },
  { ISBN: "7", Title: "Computer Book 5", Author: "Rame", Reviews: [] },
  { ISBN: "78", Title: "Social Book 6", Author: "Sita", Reviews: [] },

  // Add more books as needed
];

// Users data
const users = [];

// Middleware for checking if the user is registered
const isRegistered = (req, res, next) => {
  const { username } = req.headers;
  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    req.currentUser = userExists;
    next();
  } else {
    res.status(401).json({ error: "Unauthorized. Please register or log in." });
  }
};

// Task 1: Get the book list available in the shop
app.get("/books", (req, res) => {
  res.json(books);
});

// Task 2: Get the books based on ISBN
app.get("/books/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books.find((book) => book.ISBN === isbn);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: "Book not found." });
  }
});

// Task 3: Get all books by Author
app.get("/books/author/:author", (req, res) => {
  const { author } = req.params;
  const authorBooks = books.filter((book) => book.Author === author);
  res.json(authorBooks);
});

// Task 4: Get all books based on Title
app.get("/books/title/:title", (req, res) => {
  const { title } = req.params;
  const titleBooks = books.filter((book) => book.Title === title);
  res.json(titleBooks);
  console.log(titleBooks);
});

// Task 5: Get book Review
app.get("/books/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books.find((book) => book.ISBN === isbn);
  if (book) {
    res.json(book.Reviews);
  } else {
    res.status(404).json({ error: "Book not found." });
  }
});

// Task 6: Register New user
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  const userExists = users.find((user) => user.username === username);
  if (!userExists) {
    const newUser = { username, password };
    users.push(newUser);
    res.json({ message: "User registered successfully." });
  } else {
    res.status(400).json({ error: "Username already exists." });
  }
});

// Task 7: Login as a Registered user
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    res.json({ message: "Login successful." });
  } else {
    res.status(401).json({ error: "Invalid credentials." });
  }
});

// Middleware to check if the user is registered
app.use(isRegistered);

// Task 8: Add/Modify a book review
app.post("/books/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const book = books.find((book) => book.ISBN === isbn);
  if (book) {
    const existingReviewIndex = book.Reviews.findIndex(
      (r) => r.username === req.currentUser.username
    );
    if (existingReviewIndex !== -1) {
      // Modify existing review
      book.Reviews[existingReviewIndex].review = review;
    } else {
      // Add new review
      book.Reviews.push({ username: req.currentUser.username, review });
    }
    res.json({ message: "Review added/modified successfully." });
  } else {
    res.status(404).json({ error: "Book not found." });
  }
});

// Task 9: Delete book review added by that particular user
app.delete("/books/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books.find((book) => book.ISBN === isbn);
  if (book) {
    const reviewIndex = book.Reviews.findIndex(
      (r) => r.username === req.currentUser.username
    );
    if (reviewIndex !== -1) {
      // Delete review
      book.Reviews.splice(reviewIndex, 1);
      res.json({ message: "Review deleted successfully." });
    } else {
      res.status(404).json({ error: "Review not found." });
    }
  } else {
    res.status(404).json({ error: "Book not found." });
  }
});

// Task 10: Get all books - Using async callback function
app.get("/async-books", async (req, res) => {
  try {
    const response = await axios.get("https://api.example.com/books");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
});

// Task 11: Search by ISBN - Using Promises
app.get("/promise-isbn/:isbn", (req, res) => {
  const { isbn } = req.params;
  axios
    .get(`https:/localhost/books/${isbn}`)
    .then((response) => res.json(response.data))
    .catch(() => res.status(404).json({ error: "Book not found." }));
});

// Task 12: Search by Author
app.get("/promise-author/:author", (req, res) => {
  const { author } = req.params;
  axios
    .get(`/api.example.com/books/author/${author}`)
    .then((response) => res.json(response.data))
    .catch(() => res.status(404).json({ error: "Books not found." }));
});

// Task 13: Search by Title
app.get("/promise-title/:title", (req, res) => {
  const { title } = req.params;
  axios
    .get(`https:/localhost/api.example.com/books/title/${title}`)
    .then((response) => res.json(response.data))
    .catch(() => res.status(404).json({ error: "Books not found." }));
});

// Task 14: Submission of Project GitHub Link
app.post("/submit-link", (req, res) => {
  const { githubLink } = req.body;
  // Process the GitHub link submission
  res.json({ message: "GitHub link submitted successfully." });
});

// Server listening on port 3000
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

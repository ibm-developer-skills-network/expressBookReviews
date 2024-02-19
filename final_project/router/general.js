const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
let books = require("./booksdb.js");
const public_users = express.Router();

// Define the accounts array to store user credentials
let accounts = [];

// Sign up route
public_users.post('/signup', function (req, res) {
  const { username, password } = req.body;

  // Check if the username already exists
  if (accounts.find(account => account.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create a new account object
  const newAccount = {
    id: uuidv4(),
    username: username,
    password: hashedPassword
  };

  // Add the new account to the accounts array
  accounts.push(newAccount);

  // Redirect to the sign-in page
  res.redirect('/signin');
});

// Sign in route
public_users.post('/signin', function (req, res) {
  const { username, password } = req.body;

  // Find the account by username
  const account = accounts.find(account => account.username === username);

  // Check if the account exists and the password is correct
  if (!account || !bcrypt.compareSync(password, account.password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: account.id }, 'your-secret-key', { expiresIn: '1h' });

  // Set the token in a cookie
  res.cookie('token', token, { httpOnly: true });

  // Redirect to the index page
  res.redirect('/');
});

// Render the sign-in page
public_users.get('/signin', function (req, res) {
  res.render('signin.ejs');
});

// Render the sign-up page
public_users.get('/signup', function (req, res) {
  res.render('signup.ejs');
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  // Get book details based on author, title or ISBN
  const query = req.query.query;
  let filteredBooks = [];
  if (query) {
    filteredBooks = books.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) || 
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.isbn.toString().includes(query.toLowerCase())
    );
  } else {
    filteredBooks = books;
  }

  // Get the book list available in the shop
  res.render('index.ejs', {
    books: filteredBooks
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(book => book.isbn === parseInt(isbn));
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  res.render('review.ejs', {
    book: book
  });
});

// Edit book review
public_users.post('/review/:isbn/edit', function (req, res) {
  const isbn = req.params.isbn;
  const bookIndex = books.findIndex(book => book.isbn === parseInt(isbn));
  if (bookIndex === -1) {
    return res.status(404).json({message: "Book not found"});
  }
  const book = books[bookIndex];
  const reviewIndex = req.body.reviewIndex;
  if (reviewIndex < 0 || reviewIndex >= book.reviews.length) {
    return res.status(400).json({message: "Invalid review index"});
  }
  const editedReview = req.body.editedReview;
  book.reviews[reviewIndex] = editedReview;
  books[bookIndex] = book; // Update the books array with the updated book object
  res.redirect('/');
});

// Delete book review
public_users.post('/review/:isbn/delete', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(book => book.isbn === parseInt(isbn));
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  const reviewIndex = req.body.reviewIndex;
  if (reviewIndex < 0 || reviewIndex >= book.reviews.length) {
    return res.status(400).json({message: "Invalid review index"});
  }
  book.reviews.splice(reviewIndex, 1);
  res.redirect('/');
});

// Add book review
public_users.post('/review/:isbn/add', function (req, res) {
  const isbn = req.params.isbn;
  const book = books.find(book => book.isbn === parseInt(isbn));
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }
  const newReview = req.body.newReview;
  book.reviews.push(newReview);
  res.redirect(`/review/${isbn}`);
});

module.exports.general = public_users;
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 const {username, password} = req.body;

 if(!username || !password){
   return res.status(400).json({message: "Invalid username or password"});
 }
 if(users.includes(username)){
   return res.status(409).json({message: "Username already exists"});
 }

  users.push(username);

  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const bookList = Object.values(books).map(book => {
    return {
      title: book.title,
      author: book.author,
      isbn: book.isbn
    }
  });
  return res.status(200).json({ books: bookList });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const { isbn } = req.params;
  if (books.hasOwnProperty(isbn)) {
    const bookDetails = books[isbn];
    return res.status(200).json(bookDetails);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const booksWithTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  if (booksWithTitle.length > 0) {
    return res.status(200).json(booksWithTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  if (books.hasOwnProperty(isbn)) {
    const bookReviews = books[isbn].reviews;
    if (Object.keys(bookReviews).length > 0) {
      return res.status(200).json({ reviews: bookReviews });
    } else {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
}
);

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    
  const {username, password} = req.body;
  //check data exists in request body
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  //check if username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }
  //check if username and password are valid
  if (!isValid(username, password)) {
    return res.status(400).json({ message: "Invalid username or password" });
  }
  //add user to users object
  users[username] = password;
  //return success message
  return res.status(201).json({ message: "Customer successfully registered. Now you can login." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.json(books);//res.json(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const bookList = [];
    for (let key in books) {
      if (books.hasOwnProperty(key)) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          bookList.push({ id: key, ...books[key] });
        }
      }
    }
    if (bookList.length === 0) {
      return res.status(404).json({ message: "No books found by author " + author });
    } else {
      return res.status(200).json({ books: bookList });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;
    let result = [];
  
    for (const [key, value] of Object.entries(books)) {
      if (value.title.toLowerCase().includes(title.toLowerCase())) {
        result.push({ id: key, book: value });
      }
    }
  
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Book not found." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }
    const reviews = book.reviews;
    return res.status(200).json(reviews);
});

module.exports.general = public_users;

//This contains the skeletal implementations for the routes which a general user can access.


const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
  public_users.get('/',function (req, res) {

  //Write your code here
  res.send(JSON.stringify({books},null,4));
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
  const isbn = req.params.isbn;
  const book = books[isbn];

  // Check if the book with the given ISBN is found
  if (book) {
      // If found, send the book details as JSON response
      res.status(200).json(book);
  } else {
      // If not found, send a 404 response with an error message
      res.status(404).json({ message: "Book not found with the provided ISBN" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const authorBooks = Object.values(books).filter(book => book.author === author);

  // Check if books with the given author are found
  if (authorBooks.length > 0) {
      // If found, send the book details as JSON response
      res.status(200).json(authorBooks);
  } else {
      // If not found, send a 404 response with an error message
      res.status(404).json({ message: "Books not found with the provided author" });
  }
});



// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const decodedTitle = title.replace(/\+/g, ' ');

  const titleBooks = Object.values(books).filter(book => book.title === decodedTitle );

  // Check if books with the given author are found
  if (titleBooks.length > 0) {
      // If found, send the book details as JSON response
      res.status(200).json(titleBooks);
  } else {
      // If not found, send a 404 response with an error message
      res.status(404).json({ message: "Books not found with the provided author" });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Find the book in the 'books' object based on the numeric index
  const book = books[isbn];
  if (book) {
    // Check if the book has reviews
    if (book.reviews && Object.keys(book.reviews).length > 0) {
        // If reviews are found, send the reviews as JSON response
        res.status(200).json(book.reviews);
    } else {
        // If no reviews found, send a message
        res.status(404).json({ message: "No reviews found for the provided ISBN" });
    }
} else {
    // If the book is not found, send a 404 response with an error message
    res.status(404).json({ message: "Book not found with the provided ISBN" });
}
});

module.exports.general = public_users;

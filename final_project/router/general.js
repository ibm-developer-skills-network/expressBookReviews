const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
  const { username, password } = req.body;

  // Validate inputs
  if(!username || !password) {
    return res.status(400).send('Username and password required');
  }

  // Check if username exists
  const existingUser = users.find(user => user.username === username);
  if(existingUser) {
    return res.status(400).send('Username already exists');
  }

  // Create new user object
  const user = {
    username,
    password
  };

  // Add to users array
  users.push(user);

  // Return success response
  res.status(201).send('User registered successfully');
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    // Get books from database
    const bookList = books;

    // Return books as JSON response
    res.json(JSON.stringify(bookList, null, 2));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  
  // Get ISBN from request parameters
  const isbn = req.params.isbn;

  // Find book with matching ISBN from database
  const book = books.find(b => b.isbn === isbn);

  if(book) {
    // Return book details if found
    res.json(book);
  } else {
    // Return 404 if not found  
    res.status(404).send('Book not found');
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  
  // Get author from request params
  const author = req.params.author;

  // Get book objects keys
  const bookKeys = Object.keys(books);

  // Iterate over books array
  for(let i = 0; i < bookKeys.length; i++) {

    // Get individual book object
    const book = books[bookKeys[i]];

    // Check if author matches
    if(book.author === author) {

      // Return matching books  
      return res.json(book);

    }

  }

  // Return 404 if no match
  res.status(404).send('No books found for that author');
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
   // Get title from request params
   const title = req.params.title;

   // Get book objects keys
   const bookKeys = Object.keys(books);
 
   // Iterate over books array
   for(let i = 0; i < bookKeys.length; i++) {
 
     // Get individual book object
     const book = books[bookKeys[i]];
 
     // Check if title matches
     if(book.title === title) {
 
       // Return matching book
       return res.json(book);
 
     }
 
   }
 
   // Return 404 if no match
   res.status(404).send('No book found with that title');
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  
  // Get ISBN from params
  const isbn = req.params.isbn;

  // Find book with matching ISBN
  const book = books.find(b => b.isbn === isbn);

  if(book) {

    // Get reviews array from book
    const reviews = book.reviews;

    // Return reviews
    res.json(reviews);

  } else {

    // Return 404 if book not found
    res.status(404).send('Book not found');

  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

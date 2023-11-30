const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const axios = require('axios');
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."}); 
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        // Simulating a delay to mimic an asynchronous operation
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.send(JSON.stringify({ books }, null, 4));
      } catch (error) {
        console.error('Error fetching books:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isbn = req.params.isbn;
      res.send(books[isbn]);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  try {
  const requestedAuthor = req.params.author;
  // Simulating a delay to mimic an asynchronous operation
  await new Promise(resolve => setTimeout(resolve, 1000));
  const matchingBooks = [];

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Iterate through the 'books' array & check if the author matches the one provided in the request parameters
  bookKeys.forEach((key) => {
    const book = books[key];
    if (book.author === requestedAuthor) {
      matchingBooks.push({
        id: key,
        author: book.author,
        title: book.title,
        reviews: book.reviews,
      });
    }
  });

  // Respond with the matching books or an appropriate message
  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.send('No books found for the provided author.');
  }
} catch (error) {
    console.error('Error fetching books by author:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    try {
        const requestedTitle = req.params.title;
    const matchingBooks = [];
  
    // Obtain all the keys for the 'books' object
    const bookKeys = Object.keys(books);
  
    // Iterate through the 'books' array & check if the title matches the one provided in the request parameters
    bookKeys.forEach((key) => {
      const book = books[key];
      if (book.title === requestedTitle) {
        matchingBooks.push({
          id: key,
          author: book.author,
          title: book.title,
          reviews: book.reviews,
        });
      }
    });
  
    // Respond with the matching books or an appropriate message
    if (matchingBooks.length > 0) {
      res.send(matchingBooks);
    } else {
      res.send('No books found for the provided author.');
    }
    } catch (error) {
        console.error('Error fetching books by title:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
      }   
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const requestedISBN = req.params.isbn;

    // Check if the requested ISBN exists in the 'books' object
    if (books.hasOwnProperty(requestedISBN)) {
      const book = books[requestedISBN];
  
      // Check if the book has reviews
      if (Object.keys(book.reviews).length > 0) {
        res.send({
          isbn: requestedISBN,
          title: book.title,
          author: book.author,
          reviews: book.reviews,
        });
      } else {
        res.json({
          isbn: requestedISBN,
          title: book.title,
          author: book.author,
          reviews: [],
          message: 'No reviews available for the requested book.',
        });
      }
    } else {
      res.status(404).json({ message: 'Book not found for the provided ISBN.' });
    }
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
  //Write your code here
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
  return res.status(300).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {

        const bookList = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
            }, 1000); 
        });

        res.status(200).json(bookList);
    } catch (error) {
        console.error('Error Fetching book list', error);
        res.status(500).json({ message: "Failed to fetch book list" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const bookDetails = await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject(new Error('Book not found'));
                }
            }, 1000);
        });

        res.status(200).json(bookDetails);
    } catch (error) {
        console.error('Error Fetching book details', error);
        res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const booksByAuthor = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const matchingBooks = Object.values(books).filter(book => book.author === author);
                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject(new Error('No books found for the author'));
                }
            }, 1000); 
        });

        res.status(200).json(booksByAuthor);
    } catch (error) {
        console.error('Error Fetching books by author', error);
        res.status(404).json({ message: "No books found for the author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const booksByTitle = await new Promise((resolve, reject) => {
            setTimeout(() => {
                const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());
                if (matchingBooks.length > 0) {
                    resolve(matchingBooks);
                } else {
                    reject(new Error('No books found with the title'));
                }
            }, 1000);
        });

        res.status(200).json(booksByTitle);
    } catch (error) {
        console.error('Error Fetching books by title', error);
        res.status(404).json({ message: "No books found with the title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        const bookReviews = books[isbn].reviews;
        res.status(200).json(bookReviews);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;

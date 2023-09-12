const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password)
  {
    if(!isValid(username))
    {
        users.push({"username": username , "password" : password});
        return res.status(200).json({message :"Customer successfully registred. Now you can login"});

    }
    else{
      return res.status(404).json({message : "Customer aready exits!"});
    }
  }
    return res.status(404).json({message : "Unable to register customer!"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 // Simulate an asynchronous operation (e.g., fetching a list of books)
 let listPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Promise resolved");
  }, 3000);
});

// Use the async callback function to handle the promise
listPromise.then(() => {
  // Assuming 'books' is an array of book objects
 

  return res.status(200).json({ books });
}).catch((error) => {
  // Handle errors if necessary
  return res.status(500).json({ error: 'An error occurred' });
});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  let isbnPromise = new Promise((resolve,reject) => {
      setTimeout(() => {
      resolve("Promise resolved")
      },3000)});

  isbnPromise.then(() => {
      if( books.hasOwnProperty(isbn) )
      {
          return res.status(200).json(books[isbn]);
      }
      return res.status(300).json({message: "That ISBN of Book does not exist!"});
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
    resolve("Promise resolved")
    },3000)});

authorPromise.then(() => {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(value => value.author===author);
    
    if(!booksByAuthor.length) return res.status(300).json({message:"That Authoer name of Book does not exit!"});
    return res.status(200).json({booksByAuthor});
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let titlePromise = new Promise((resolve,reject) => {
    setTimeout(() => {
    resolve("Promise resolved")
    },3000)});

titlePromise.then(() => {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(value => value.title===title);
    
    if(!booksByTitle.length) return res.status(300).json({message:"That title of book does not exit!"});
    return res.status(200).json({booksByTitle});

})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if( books.hasOwnProperty(isbn) )
  {
      return res.status(200).json({ Title: books[isbn].title, reviews:books[isbn].reviews });
  }
  return res.status(300).json({message:"We don't have that book."});
});

module.exports.general = public_users;

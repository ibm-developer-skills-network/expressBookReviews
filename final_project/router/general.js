const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username; 
    const password = req.body.password;
    if(username && password){
        if (!doesExist(username)){
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User is now registered."});
        } 
        else{
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify({books}, null, 4)));
  });
    get_books.then(() =>  console.log("Task 10 Promise Resolved"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const book_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(book) {
      resolve(res.send(book));
    } 
    reject(res.status(404).json({message:"ISBN not present"}));
    book_isbn.then(function() {
      console.log("Task 11 Promise Resolved");
    }).catch(function() {
      console.log("Task 11 Promise Rejected");
    });
 });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const book_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn].author === author) {
        booksbyauthor.push({"isbn":isbn,
        "title":books[isbn]["title"],
        "reviews":books[isbn]["reviews"]});
        resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }
    });
    reject(res.status(404).json({message:"Author not found"}));
  });
  book_author.then(function() {
    console.log("Task 12 Promise Resolved");
  }
  ).catch(function() {
    console.log("Task 12 Promise Rejected");
  }
  );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const book_title = new Promise((resolve, reject) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn].title === title) {
        booksbytitle.push({"isbn":isbn,
        "author":books[isbn]["author"],
        "reviews":books[isbn]["reviews"]});
        resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
      }
    });
    reject(res.status(404).json({message:"Title not found"}));
  });
  book_author.then(function() {
    console.log("Task 13 Promise Resolved");
  }
  ).catch(function() {
    console.log("Task 13 Promise Rejected");
  }
  );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  res.send(book.reviews);
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
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
      return res.status(200).json({message: "User " +username+ " successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User " +username+ " already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksbyauthor= [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbyauthor}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let booksbyisbn= [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["isbn"] === req.params.isbn) {
        booksbyisbn.push({"reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbyisbn}, null, 4)); 
});


// get all books
function getAllBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 3000);
  
      return;
    });
  }
  
  // get all books with given isbn
  function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (!book) {
          reject("Book not found");
        }
        resolve(book);
      }, 3000);
    });
  }

  // get all books with given author
  function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByAuthor = [];
        for (const key in books) {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        }
        if (booksByAuthor.length === 0) {
          reject("Book not found");
        }
        resolve(booksByAuthor);
      }, 3000);
    });
  }
  
// get all books with given title
function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (const key in books) {
          if (books[key].title === title) {
            resolve(books[key]);
          }
        }
        reject("Book not found");
      }, 3000);
    });
  }

module.exports.general = public_users;
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ errorMessage: "You have to provide username & password" });
  }

  if (isValid(username)) {
    users.push({
      username,
      password
    })
    return res.send("You are now registered. Please login!");
  } else {
    return res.status(400).json({ errorMessage: "This username already exists" });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    getBooksAsync()
    .then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: "Failed to get books" });
    })
});
function getBooksAsync() {
    return new Promise((resolve) => {
      resolve(JSON.stringify(books, null, 4));
    });
  }
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getBookByIsbnAsync(isbn)
      .then(bookRecord => {
        return res.send(bookRecord);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
 });
 function getBookByIsbnAsync(isbn) {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book Wasn't Found");
      }
    });
  }


public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBookByAuthorAsync(author).then(response => {
        return res.send(response);
      }).catch(err => {
        return res.status(404).json({ errorMessage: err });
      })
});

function getBookbyAuhtorAsync(author){
    return new Promise((resolve, reject)=>{
        const booksExist = Object.values(books).filter(book => book.author == author);
         if (booksExist.length > 0) {
         resolve(booksExist);
         } 
         else {
             reject("Book Wasn't Found");
            }
         }
    )
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBookByTitleAsync(title).then(response => {
      return res.send(response);
    }).catch(err => {
      return res.status(404).json({ errorMessage: err });
    })
});

function getBookByTitleAsync(title) {
    return new Promise((resolve, reject) => {
      const booksExist = Object.values(books).filter(book => book.title == title);
      if (booksExist.length > 0) {
        resolve(booksExist);
      } else {
        reject("Book Wasn't Found");
      }
    });
  }
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;

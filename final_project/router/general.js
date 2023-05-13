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
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if(author){
    let fil_book = Object.values(books).filter(book => book.author === author);
    if(fil_book.length>0){
        res.send(JSON.stringify(fil_book,null,4));
    }
    else{
        res.send("Book doesn't exist with this authoe");
    }
  }
  else{
      res.sendStatus("Please pass some value for author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    if(title){
      let fil_book = Object.values(books).filter(book => book.title === title);
      if(fil_book.length>0){
          res.send(JSON.stringify(fil_book,null,4));
      }
      else{
          res.send("Book doesn't exist with this title");
      }
    }
    else{
        res.sendStatus("Please pass some value for title");
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let authenticatedUser = require("./auth_users.js").authenticatedUser;
let users = require("./auth_users.js").users;
const jwt = require('jsonwebtoken');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username
  let password = req.body.password

  if (username && password){
    
    if (isValid(username)){
        users.push({"username": username, "password": password})
        return res.send(username + " Registerd")
    }
    else{
        return res.send("username alr exists")
    }
    
    
  }
  else{
      return res.send("username or pwd not provided")
  }
  
  
  
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]

  if (book){
    return res.send(JSON.stringify(book, null, 4))
  }
  else{
      return res.send("cant find isbn")
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  for (const key in books){
      let book = books[key]
      
      if (book.author === author){
        return res.send(JSON.stringify(book, null, 4));
      }
  }
  return res.send("author not found")
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    for (const key in books){
        let book = books[key]
        
        if (book.title === title ){
          return res.send(JSON.stringify(book, null, 4));
        }
    }
    return res.send("title not found")
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  const book = books[isbn]
  if (book){
      res.send(JSON.stringify(book.reviews, null, 4))
  }
  else{
    return res.send("isbn not found")
  }
 
});

public_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (authenticatedUser(username, password)) {
      let payload = { username, password };
      let secretKey = "secret";
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  
      return res.json({ message: "User logged in", token });
    } else {
      return res.status(401).json({ message: "Incorrect creds" });
    }
  });
  
  

module.exports.general = public_users;

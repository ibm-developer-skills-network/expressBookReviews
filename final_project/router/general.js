const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  if(req.body.username && req.body.password) 
  {
    let checkUsername = users.filter((user) => { return (user.username == req.params.username && user.password == req.params.password) });
    if(checkUsername.length == 0)
    {
        users.push({ username: req.body.username, password: req.body.password});
        res.status(200).json({'message': 'Customer successfully registered. Now you can login'});
    }
    else
    {
        res.status(404).json({'message': 'Customer already exists'});
    }
  }
  else
  {
    res.status(404).json({'message': 'Username and password not provided'});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return res.send(JSON.stringify(books[req.params.isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  if(req.params.author)
  {
    let book = null;
    let keys = Object.keys(books);
    
    for (key in keys) {
        console.log(key)
       let element = books[parseInt(key)+1];
       if(element.author == req.params.author)
            book = element; 
    }
    if(book)
    {
        res.send(JSON.stringify(book));
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    if(req.params.title)
    {
      let book = null;
      let keys = Object.keys(books);
      
      for (key in keys) {
          console.log(key)
         let element = books[parseInt(key)+1];
         if(element.title == req.params.title)
              book = element; 
      }
      if(book)
      {
          res.send(JSON.stringify(book));
      }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    return res.send(books[req.params.isbn].reviews);
});

module.exports.general = public_users;

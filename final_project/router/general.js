const express = require('express');
let books = require("./booksdb.js");
let isInUse = require("./auth_users.js").isInUse;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register/",(req,res)=>{
    const username = req.query.username;
    const password = req.query.password;

    if (username && password) {
      if (!isInUse(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let booksbyauthor = [];
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
    let item = {};
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        item = {"isbn":isbn,
                            "title":books[isbn]["title"],
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]};
      }
    });
    res.send(JSON.stringify({item}, null, 4));
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
  });

module.exports.general = public_users;

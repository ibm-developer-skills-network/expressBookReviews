const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  username = req.body.username;
  password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username": username, "password": password});
      console.log(users);
      return res.status(200).json({message: "User " + username + " was created!"});
    } else res.status(400).json("User already exists!");
  } res.send("Error!!! please enter a username and password!");

});


const doesExist = (username) => {
  let sameName = users.filter((user) => {
    return user.username === username;
  });
  if (sameName.length > 0) {
    return true;
  } else {
    return false;
  }
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // await axios.get("https://raekwill15-5000.theiadocker-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/")
  //       .then(stuff => res.json(stuff.data))
  //       .catch(err => next(err))
  //       res.send("Ok")
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  bookNum = req.params.isbn;
  return res.status(300).send(books[bookNum]);
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let fromAuthor = [];
  for (x in books) {
    if (books[x].author.toLowerCase() === author.toLowerCase()) {
      fromAuthor.push(books[x]);
    }
  }
  return res.status(300).json(fromAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title; 
  for (x in books) {
    if (books[x].title.toLowerCase() === title.toLowerCase()) {
      return res.status(300).json(books[x]);
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookNum = req.params.isbn;
  return res.status(300).json(books[bookNum].reviews);
});


module.exports.general = public_users;

const express = require('express');
const axios = require("axios");
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
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const respBook = Object.values(books).filter(book=>book.author === author);
    res.send(JSON.stringify(respBook,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const respBook = Object.values(books).filter(book=>book.title === title);
    res.send(JSON.stringify(respBook,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews,null,4));
});

public_users.put('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.body.username;
    let book = books[isbn];
    if (book && username && review) {
        books[isbn].reviews[username] = review;
        res.send(JSON.stringify(books[isbn].reviews,null,4));
    }
    else{
        res.send("Unable to find book!");
    }
});

public_users.delete('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const username = req.body.username;

    let book = books[isbn];
    if (book && username) {
        let tempBookReviews = {};
        Object.keys(books[isbn].reviews).forEach(element => {
            if(element!==username){
                tempBookReviews[element]=books[isbn].reviews[element];
            }
        });
        books[isbn].reviews = tempBookReviews;
        res.send(JSON.stringify(books[isbn].reviews,null,4));
    }
    else{
        res.send("Unable to find book!");
    }
});


public_users.get("/axios/books", (req, res, next) => {
    axios.get("https://waraujo-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/")
      .then(data => res.send(JSON.stringify(data.data,null,4)))
      .catch(err => next(err));
});

public_users.get("/axios/isbn/:isbn", (req, res, next) => {
    const isbn = req.params.isbn;
    axios.get(`https://waraujo-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${isbn}`)
      .then(data => res.send(JSON.stringify(data.data,null,4)))
      .catch(err => next(err));
});

public_users.get("/axios/author/:author", (req, res, next) => {
    const author = req.params.author;
    axios.get(`https://waraujo-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${author}`)
      .then(data => res.send(JSON.stringify(data.data,null,4)))
      .catch(err => next(err));
});

public_users.get("/axios/title/:title", (req, res, next) => {
    const title = req.params.title;
    axios.get(`https://waraujo-5000.theiadocker-2-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${title}`)
      .then(data => res.send(JSON.stringify(data.data,null,4)))
      .catch(err => next(err));
});

module.exports.general = public_users;

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js");
let users = require("./auth_users.js");
const public_users = express.Router();

let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!isValid(username)){
      users.push({"username": username, "password": password});
      return res.status(200).json({message:"Congradulations!! User registered successfully. You can now login"});
    }
    else{
      return res.status(404).json({message:"Sorry!! Try another username, this one is taken"});
    }
  }
  else{
    return res.status(404).json({message:"Sorry!! Uable to register"})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  mypromise.res.send(JSON.stringify(books,null,10));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.prop.isbn;
  mypromise.res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  object.keys(books).forEach(value =>{
      let author = req.params.author;
      mypromise.res.send(books[author]);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  object.keys(books).forEach(value =>{
    let title = req.params.title;
    mypromise.res.send(books[title]);
})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  if(isbn){
    let review = req.params.review;
    res.send(`Thes are the reviews:`+ `${review}`);
  }
});

module.exports.general = public_users;


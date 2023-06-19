const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer with same username already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    let myPromise = new Promise((resolve, reject) => {
        res.send(JSON.stringify(books));
    })

    myPromise.then(() => {
        console.log("myPromise is resolved")
    })

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
    let reqBook = books[isbn]
  
    let myPromise = new Promise((resolve, reject) => {
        res.send(JSON.stringify(reqBook))
    })

    myPromise.then(() => {
        console.log("myPromise is resolved")
    })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  
  let myPromise = new Promise((resolve, reject) => {
    for(i=1; i<=10; i++){
        let bookObj = books[i]
        if(bookObj.author == author){
            res.send(JSON.stringify(bookObj))
        }
    }
  })

    myPromise.then(() => {
        console.log("myPromise is resolved")
    })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title
  let myPromise = new Promise((resolve, reject) => {
    for(i=1; i<=10; i++){
        let bookObj = books[i]
        if(bookObj.title == title){
            res.send(JSON.stringify(bookObj))
        }
    }
  })

  myPromise.then(() => {
    console.log("myPromise is resolved")
  })
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    
    let isbn = req.params.isbn
    let reqBook = books[isbn]
  
    res.send(JSON.stringify(reqBook.reviews))
  
});

module.exports.general = public_users;

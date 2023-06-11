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
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({books},null,4));
});
// Get the book list available in the shop using promises
public_users.get('/async',function (req, res) {
    let myPromise = new Promise((resolve,reject) => {
          resolve(res.send(JSON.stringify({books},null,4)));
        });
    myPromise.then((successMessage) => {
        console.log("Promised Resolved")
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
 // Get book details based on ISBN using promises
public_users.get('/isbn/:isbn/async',function (req, res) {
    const isbn = req.params.isbn;
    let myPromise = new Promise((resolve,reject) => {
        resolve(res.send(books[isbn]));
    });
    myPromise.then((successMessage) => {
        console.log("Promised Resolved")
    })
 });

 // Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    for (let isbn in books) {
        if (books[ibsn].author === author) {
            resolve(res.send(books[isbn]));
        }
    }
});
  
// Get book details based on author using promises
public_users.get('/author/:author/async',function (req, res) {
    const author = req.params.author;
    for (let ibsn in books) {
        if (books[ibsn].author === author) {
            let myPromise = new Promise((resolve,reject) => {
                resolve(res.send(books[ibsn]));
            });
            myPromise.then((successMessage) => {
                console.log("Promised Resolved")
            })
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    for (let isbn in books) {
        if (books[ibsn].title === title) {
            res.send(books[isbn]);
        }
    }
});

// Get all books based on title using promises
public_users.get('/title/:title/async',function (req, res) {
    const title = req.params.title;
    for (let ibsn in books) {
        if (books[ibsn].title === title) {
            let myPromise = new Promise((resolve,reject) => {
                resolve(res.send(books[ibsn]));
            });
            myPromise.then((successMessage) => {
                console.log("Promised Resolved")
            })
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    res.send(book.reviews);
});

module.exports.general = public_users;

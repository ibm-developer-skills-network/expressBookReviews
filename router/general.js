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
  //Write your code here
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


  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
// public_users.get('/', new Promise((resolve, reject) {
//   //Write your code here
//   let myPromise1 = new Promise((resolve,reject) => {
//     setTimeout(() => {
//       resolve("Promise 1 resolved")
//     },6000)})
//     return resolve.send(JSON.stringify({books}, null))

// )});

let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(JSON.stringify({books}, null))
      //return res.send(JSON.stringify({books}, null))

    },6000)})

public_users.get('/',function (req, res) {
    //Write your code here
    res.send(myPromise1)
    //return res.status(300).json({message: "Yet to be implemented"});
  });

// Get book details based on ISBN

public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let booksArray = Object.values(books);
    let filteredBooks = booksArray.filter(book => book.isbn === isbn);
    //const jsons = books.JSON.stringify({filtered_books})
    res.send(filteredBooks);  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authors = req.params.author;
    let booksArray = Object.values(books);
    let filteredBooks = booksArray.filter(book => book.author === authors);
    res.send(filteredBooks);  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const titles = req.params.title;
    let booksArray = Object.values(books);
    let filteredBooks = booksArray.filter(book => book.title === titles);
    res.send(filteredBooks);  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let booksArray = Object.values(books);
    let filteredBooks = booksArray.filter(book => book.isbn === isbn);
    //console.log('filteredBooks', filteredBooks);
    let reviwes = []
    filteredBooks.map((item) => {
        if(item.reviews){
            reviwes.push(item)
        }
    })
    res.send(reviwes);  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

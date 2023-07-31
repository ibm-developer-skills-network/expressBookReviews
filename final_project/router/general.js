const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

let bookarray = Object.values(books);


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
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
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
let isbn = req.params.isbn
res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filetered_books =  bookarray.filter((book) => book.author === author);
  res.send(filetered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
const title = req.params.title;
let filetered_books = bookarray.filter((book)=> book.title === title);
res.send(filetered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  //let filetered_books = bookarray.filter((book)=> book.isbn === isbn);
  res.send(books[isbn].reviews);
  });



const connectToURL = (url)=>{
  const req = axios.get(url);
  console.log(req);
  req.then(resp => {
      let listOfWork = resp.data.work;
      listOfWork.forEach((work)=>{
        console.log(work.titleAuth);
      });
    })
  .catch(err => {
      console.log(err.toString())
  });
}
console.log("Before connect URL")
connectToURL('/isbn/:isbn');
console.log("After connect URL")


module.exports.general = public_users;

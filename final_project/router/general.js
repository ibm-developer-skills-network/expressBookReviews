const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let prompt = require('prompt-sync')();
let fs = require('fs');

//to convert book json dictionnary to an array
let book = Object.values(books);

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename > 0){
    return true;
  }else{
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

//checking is username already exists in the list of registered users

  if (username && password){
    if (!doesExist(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message : "User successfully registred. Now you can login"});
      
    }else{
      return res.status(404).json({message: 'User already exists'});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify({books},null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
      res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_book = book.filter((bookFound) => bookFound.author = author);

  res.send(filtered_book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_title = book.filter((titleFound) => titleFound.title = title);

  res.send(filtered_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
      res.send(books[isbn].reviews);
  
});

//Using promises 
const getBooksPromise = new Promise((resolve,reject)=>{
  let filename = './router/booksdb.js';
  
  try {
    const data = fs.readFileSync(filename, {encoding:'utf8', flag:'r'}); 
    resolve(data);
  } catch(err) {
    reject(err)
  }
});


getBooksPromise.then(
(data) => console.log(data),
(err) => console.log("Error reading file") 
);






module.exports.general = public_users;

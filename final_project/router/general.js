const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const checkExist = (username) =>{
  let usernameInList = users.filter((user) => user.username === username);
  if(usernameInList.length > 0){
    return true;
  }
  else{
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username_input = req.body.username;
  const password_input = req.body.password;
  if(username_input && password_input){
    if(!checkExist(username_input)){
      users.push({"username": username_input, "password": password_input});
      return res.status(200).json({message: "User successfully registered"});
    }
    else{
      return res.status(404).json({ message: "User existed!"});
    }
  }
  return res.status(404).json({ message: "Unable to register user(check username and password input)"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  res.send(books[ISBN]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let result = [];
  for(const [key, values] of Object.entries(books)){
    const book = Object.entries(values);
    for(let i = 0; i < book.length; i++){
      if(book[i][0] == 'author' && book[i][1] == req.params.author){
        result.push(books[key]);
      }
    }
  }
  if(result == 0){
    return res.status(300).json({ message: "Author not found"});
  }
  res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let result = [];
  for(const [key, values] of Object.entries(books)){
    const book = Object.entries(values);
    for(let i = 0; i < book.length; i++){
      if(book[i][0] == 'title' && book[i][1] == req.params.title){
        result.push(books[key]);
      }
    }
  }
  if(result.length == 0){
    return res.status(300).json({ message: "Title not found"});
  }
  res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

function getBooks(){
  return new Promise((resolve, reject) =>{
    resolve(books);
  })
}

public_users.get('/', function(req, res){
  getBooks().then(
    (book) => res.send(JSON.stringify(book, null, 4)),
    (error) => res.send("error happened")
  )
});

function getISBN(isbn){
  let book_target = books[isbn];
  return new Promise((resolve, reject) =>{
    if(book_target){
      resolve(book_target);
    }
    else{
      reject("Unable to find book with input ISBN");
    }
  })
}

public_users.get('/isbn/:isbn', function(req, res){
  const isbn = req.params.isbn;
  getISBN(isbn).then(
    (book) => res.send(JSON.stringify(book, null, 4)),
    (error) => res.send(error)
  )
});

function getAuthor(author){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_target = books[isbn];
      if (book_target.author === author){
        output.push(book_target);
      }
    }
    resolve(output);  
  })
}
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getAuthor(author)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});

function getTitle(title){
  let output = [];
  return new Promise((resolve,reject)=>{
    for (var isbn in books) {
      let book_target = books[isbn];
      if (book_target.title === title){
        output.push(book_target);
      }
    }
    resolve(output);  
  })
}

public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getTitle(title)
  .then(
    result =>res.send(JSON.stringify(result, null, 4))
  );
});


module.exports.general = public_users;

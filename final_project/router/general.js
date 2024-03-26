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
  const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
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
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
  const isbn=req.params.isbn;
  
  res.send(books[isbn]);
  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
  const author=req.params.author;
  let booksbyauthor;
  for(i in books){
    if(books[i]["author"]===author)
        //console.log(books[i]);
        booksbyauthor =books[i];
}
 
  res.send(booksbyauthor);
  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
 // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
  const title=req.params.title;
 let booksbytitle;
 for(i in books){
   if(books[i]["title"]===title)
       //console.log(books[i]);
       booksbytitle =books[i];
}

 res.send(booksbytitle);
 myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
 // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
  const isbn=req.params.isbn;
  let booksbytitle;
  for(i in books){
    if(i===isbn)
         booksbytitle =books[i];
 }
 
  res.send(booksbytitle["reviews"]);
  //return res.status(300).json({message: "Yet to be implemented"});
  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
});

module.exports.general = public_users;

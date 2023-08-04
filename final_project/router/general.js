const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let doesExist = require("./auth_users.js").doesExist;
const public_users = express.Router();
let regd_users = require("./auth_users.js").regd_users;


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
    let myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve("task 10 resolved")
          reject("task 10 not resolved")
        },1000)})

        myPromise1.then((successMessage) => {
            console.log("From Callback " + successMessage)
            return res.status(200).send(books);      
          }).catch((errorMessage) => console.log(errorMessage))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  
  let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("task 11 resolved")
      reject("task 11 not resolved")
    },1000)})

    myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage)
        return res.status(200).send(books[isbn]);      
      }).catch((errorMessage) => console.log(errorMessage))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let books2={};
  
  let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("task 12 resolved")
      reject("task 12 not resolved")
    },1000)})

    myPromise1.then((successMessage) => {
        for(let k in books){
            if(books[k].author==author)
            {
                books2[k]=books[k];//n++;
            }
        }      
        console.log("From Callback " + successMessage)
        return res.status(200).send(books2);      
      }).catch((errorMessage) => console.log(errorMessage))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let books2={};
  
  let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("task 13 resolved")
      reject("task 13 not resolved")
    },1000)})

    myPromise1.then((successMessage) => {
        for(let k in books){
      
            if(books[k].title==title)
            {
                books2[k]=books[k];
            }
        }
        console.log("From Callback " + successMessage)
        return res.status(200).send(books2);      
      }).catch((errorMessage) => console.log(errorMessage))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  let myoutput={};
  myoutput[isbn] = books[isbn].reviews;
  //for(let k in books){
      
      //if(k==isbn)
      //{
         //output[k]=books[k];
      //}
  //}
  //res.send(books2);
  return res.status(200).send(myoutput);//.json({message: "OK"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

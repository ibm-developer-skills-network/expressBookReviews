const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

public_users.get('/',function (req, res) {

    const myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
              res.send(JSON.stringify(books,null,4));
            console.log("hello from promise")
        },600)})

        myPromise1.then((successMessage) => {
            console.log("From Callback " + successMessage)
          })
       
});

public_users.get('/isbn/:isbn',function (req, res) {
    const islbC = req.params.isbn;

    
    const myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log("hello from promise")
            return res.send(books[islbC])
              
        },600)})

        myPromise1.then((successMessage) => {
            console.log("From Callback " + successMessage)
          })
       

   
 });  
 

public_users.get('/author/:author',function (req, res) {
    const autor = req.params.author;
    const libros = Object(books);
    let arrayLibros = []
    
    const myPromise1 = new Promise((resolve,reject) => {
        setTimeout(() => {
            console.log("hello from promise")
            for(let i=1;i<=Object.keys(libros).length;i++) 
            { 
              if(Array(books,null,4)[0][i].author==autor){
                let data = { isbn:i,
                          author:Array(books,null,4)[0][i].author,
                    title:Array(books,null,4)[0][i].title,
                    reviews:Array(books,null,4)[0][i].reviews
                }
                arrayLibros.push(data)
              }     
            }  
            return res.send(arrayLibros)
        },600)})
      

        myPromise1.then((successMessage) => {
            console.log("From Callback " + successMessage)
          })
       
});

public_users.get('/title/:title',function (req, res) {
const title = req.params.title;
const libros = Object(books);
let arrayLibros = []
let myPromise1 = new Promise((resolve,reject) => {
    setTimeout(() => {
 for(let i=1;i<=Object.keys(libros).length;i++) 
{ 
  if(Array(books,null,4)[0][i].title==title){
    let data = { isbn:i,
              author:Array(books,null,4)[0][i].author,
        title:Array(books,null,4)[0][i].title,
        reviews:Array(books,null,4)[0][i].reviews
    }
    arrayLibros.push(data)
  }     
}  
return res.send(arrayLibros)
},6000)})

});

public_users.get('/review/:isbn',function (req, res) {
 
  const islbC = req.params.isbn;
  const libros = Object(books[islbC]);

  return res.send(Array(libros)[0].reviews)
});


module.exports.general = public_users;


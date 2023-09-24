const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js");
let users = require("./auth_users.js");
const public_users = express.Router();


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
public_users.get('/',async function (req, res) {
  //Write your code here
  await Promise.resolve(res.send(JSON.stringify(books,null,10)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  let isbn = req.params.isbn;
  await Promise.resolve(res.send(books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    let values = Object.values(books);
    let check = Object.values(values[0]);
    let check1 = Object.values(values[1]);
    let check2 = Object.values(values[2]);
    let check3 = Object.values(values[3]);
    let check4 = Object.values(values[4]);
    let check5 = Object.values(values[5]);
    let check6 = Object.values(values[6]);
    let check7 = Object.values(values[7]);
    let check8 = Object.values(values[8]);
    let check9 = Object.values(values[9]);
    let CHECK =[check,check1,check2,check3,check4,check5,check6,check7,check8,check9]
    let author = req.params.author;
    if(CHECK[0][0]==author){
    await Promise.resolve( res.send(books[1]));
   }
    if (CHECK[1][0]==author) {
    await Promise.resolve( res.send(books[2]));
   }
   else if (CHECK[2][0]==author) {
    await Promise.resolve(res.send(books[3]));
   }
   else if (CHECK[3][0]==author) {
    await Promise.resolve(res.send(books[4]));
   }
   else if (CHECK[4][0]==author) {
    await Promise.resolve(res.send(books[5]));
   }
   else if (CHECK[5][0]==author) {
    await Promise.resolve(res.send(books[6]));
   }
   else if (CHECK[6][0]==author) {
    await Promise.resolve(res.send(books[7]));
   }
   else if (CHECK[7][0]==author) {
    await Promise.resolve(res.send(books[8]));
   }
   else if (CHECK[8][0]==author) {
    await Promise.resolve(res.send(books[9]));
   }
   else if (CHECK[9][0]==author) {
    await Promise.reslove(res.send(books[10]));
   }
   })
   
   // Get all books based on title
   public_users.get('/title/:title',async function (req, res) {
     let values = Object.values(books);
     let check = Object.values(values[0]);
     let check1 = Object.values(values[1]);
     let check2 = Object.values(values[2]);
     let check3 = Object.values(values[3]);
     let check4 = Object.values(values[4]);
     let check5 = Object.values(values[5]);
     let check6 = Object.values(values[6]);
     let check7 = Object.values(values[7]);
     let check8 = Object.values(values[8]);
     let check9 = Object.values(values[9]);
     let CHECK =[check,check1,check2,check3,check4,check5,check6,check7,check8,check9]
     let title = req.params.title;
     if(CHECK[0][1]==title){
      await Promise.reslove(res.send(books[1]));
    }
     if (CHECK[1][1]==title) {
      await Promise.resolve(res.send(books[2]));
    }
    else if (CHECK[2][1]==title) {
      await Promise.resolve(res.send(books[3]));
    }
    else if (CHECK[3][1]==title) {
      await Promise.resolve(res.send(books[4]));
    }
    else if (CHECK[4][1]==title) {
      await Promise.resolve(res.send(books[5]));
    }
    else if (CHECK[5][1]==title) {
      await Promise.resolve(res.send(books[6]));
    }
    else if (CHECK[6][1]==title) {
      await Promise.reslve(res.send(books[7]));
    }
    else if (CHECK[7][1]==title) {
      await Promise.resolve(res.send(books[8]));
    }
    else if (CHECK[8][1]==title) {
     await Promise.resolve(res.send(books[9]));
    }
    else if (CHECK[9][1]==title) {
     await Promise.resolve(res.send(books[10]));
    }
    });
   

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  let isbn = req.params.isbn;
  if(isbn){
    let review = req.params.review;
   await Promise.resolve(res.send(`Thes are the reviews:`+ `${review}`));
  }
});

module.exports.general = public_users;


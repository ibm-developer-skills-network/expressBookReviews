const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

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
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"}); 
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
//Write your code here
try {
const allBooks = await Promise.resolve(books);
return res.status(200).send(JSON.stringify(allBooks, null, 4));
} catch (error) {
return res.status(500).json({ message: "Error, book list not recieved" });
}
//res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
const booksISBN = async isbn=>{
    try{
        const booksByISBN = await Promise.resolve(isbn);
        return Promise.resolve(isbn)
    } catch(error){
        return res.status(500).json({ message: "Error, isbn not found" });
    }
}
public_users.get('/isbn/:isbn',async function (req, res) {
//Write your code here
const isbn = req.params.isbn;
const book = await booksISBN(isbn)
res.send(books[book])
});

// Get book details based on author
const booksAuthor = async author=>{
    let authorRequested = [];
    
    try{
        //const booksByAuthor= await Promise.resolve(author);
        //if(author){ 
        for(const [key, values] of Object.entries(books)){
            const bookDetails = Object.entries(values);
         
            for(let x = 0;x < bookDetails.length;x++){
               
                if (bookDetails[x][0] === 'author'){
                    if(bookDetails[x][1] === author){
                        let keyDetails = books[key];
                        authorRequested.push(keyDetails);
                    }
                } 
            }
        
        }
        return Promise.resolve(authorRequested)
    } catch(error){
        console.log( `Error, author not found`);
    }
}
public_users.get('/author/:author', async function (req, res) {
//Write your code here
    const author = req.params.author;
    const authorData = await booksAuthor(author);
    res.send(authorData);
});

// Get all books based on title
const booksTitle = async title=>{
    let titleRequested = [];
    
    try{
        for(const [key, values] of Object.entries(books)){
            const bookDetails = Object.entries(values);
         
            for(let x = 0;x < bookDetails.length;x++){
               
                if (bookDetails[x][0] === 'title'){
                    if(bookDetails[x][1] === title){
                        let keyDetails = books[key];
                        titleRequested.push(keyDetails);
                    }
                } 
            }
        
        }
        return Promise.resolve(titleRequested)
    } catch(error){
        console.log( `Error, title not found`);
    }
}
public_users.get('/title/:title', async function (req, res) {
//Write your code here
    const title = req.params.title;
    const titleData = await booksTitle(title);
    res.send(titleData);
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews)
});

module.exports.general = public_users;
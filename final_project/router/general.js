const express = require('express');
const jwt = require('jsonwebtoken');
const { isValid, users } = require("./auth_users.js");
let books = require("./booksdb.js");

const public_users = express.Router();

public_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }
    
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generar token de acceso
    const accessToken = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

    return res.status(200).json({ accessToken });
});

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (!isValid(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. You can now login." });
    } else {
        return res.status(409).json({ message: "User already exists." });
    }
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn
books.forEach((Element)=>{
    if (Element.id == isbn){
        return(res.send(Element))
    }})
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author
    let  authorList = []
    books.forEach(Element => {
        if(Element.author == author){
            authorList.push(Element)
        }
    });
    return(res.send(authorList));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    books.forEach((Element)=>{
        if (Element.title == title){
            return(res.send(Element))
        }})
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn
    books.forEach((Element)=>{
        if (Element.id == isbn){
            return(res.send(Element.reviews))
        }})
     });







module.exports.general = public_users;

function authenticatedUser(username, password) {
    const user = users.find(u => u.username === username && u.password === password);
    return !!user; // Devuelve verdadero si se encuentra el usuario, falso de lo contrario
}
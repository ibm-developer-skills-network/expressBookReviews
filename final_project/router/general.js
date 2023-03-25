const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken')
const session = require('express-session')
const axios = require("axios");

public_users.use(
    session({secret: 'fingerpint'}, (resave = true), (saveUninitialized = true)))

public_users.post("/register", (req,res) => { // registers a user to server (#6)
    const username = req.body.username; // retrieves Username from URL Query
    const password = req.body.password; // retrieves Password from URL Query

    if (username && password) { // Checks for valid credentials, registers the user
      if (!isValid(username)) {users.push({"username":username,"password":password});
        return res.status(200).json({message: "User is now successfully registered. You may now login"});
      } 
      else {return res.status(404).json({message: "User already exists! Please try again!"});}
    }
    return res.status(404).json({message: "Unable to register user. Unknown error detected."});
});


const authenticatedUser = (username, password) => {
	//returns a boolean value; Finds user, if there is a real one.
	const userMatch = users.filter(
        user => user.username === username && user.password === password)
	return userMatch.length > 0;
}


public_users.post('/login', (req, res) => { //Logs in a user  with a JWT (#7) 
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(404).json({message: 'Error logging in'})
	}
	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign({data: password,},'access',{expiresIn: 60 * 60})
		req.session.authorization = {accessToken,username,}
		return res.status(200).send('User successfully logged in')} 
    else {return res.status(208).json({message: 'Invalid Login. Check username and password'})}})



// Get the book list available in the shop w/ Async (#10)
public_users.get("/async", async (req, res) => {
    let response = await axios.get("http://localhost:5000/");
    return res.send(response.data);});

// Get the book list available in the shop (#1)
public_users.get('/',function (req, res) {
    res.send(JSON.stringify({ books }, null, 4));});



// Get book details based on ISBN selected w/ Async (#11)
public_users.get("/async/isbn/:isbn", (req, res) => {
    axios.get("http://localhost:5000/isbn/" + req.params.isbn)
      .then((response) => {return res.status(200).json(response.data);})
      .catch((err) => {return res.send(err);});
});

// Get book details based on ISBN selected (#2)
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });



// Get book details based on author w/ Async (#12)
public_users.get("/async/author/:author", async (req, res) => {
    let response = await axios.get("http://localhost:5000/author/"+req.params.author);
    return res.status(200).json(response.data);
  });

// Get book details based on author (#3)
public_users.get('/author/:author',function (req, res) {
    const targetAuthor = req.params.author;
    const BookAuthors = Object.entries(books);
    const filteredBooks = [];
    for (const [key, SelectAuth] of BookAuthors){
        if(SelectAuth.author === targetAuthor){filteredBooks.push(SelectAuth);}}
    res.send(filteredBooks);});



// Get all books based on title w/ Async (#13)
public_users.get("/async/title/:title", async (req, res) => {
    let response = await axios.get("http://localhost:5000/title/"+req.params.title);
    return res.status(200).json(response.data)});
    
// Get all books based on title (#4)
public_users.get('/title/:title',function (req, res) {
    const targetTitle = req.params.title;
    const BookTitles = Object.entries(books);
    const filteredBooks = [];

    for (const [key, selectTitle] of BookTitles){
        if(selectTitle.title === targetTitle){
            filteredBooks.push(selectTitle);}}
    res.send(filteredBooks);});



//  Get a book review (#5)
public_users.get('/review/:isbn',function (req, res) {
    const targetisbn = req.params.isbn;
    const book = books[targetisbn];
    res.send(book.reviews);});



//  Update a book review
public_users.put('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn
    const review = req.body.review
    const username = req.session.authorization.username
    if (books[isbn]) {
        let book = books[isbn]
        book.reviews[username] = review
        return res.status(200).send('Review successfully posted')} 
    else {return res.status(404).json({message: `ISBN ${isbn} not found`})}
})



//  Delete a book review (#9)
public_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization.username
    if (books[isbn]) {
        let book = books[isbn]
        delete book.reviews[username]
        return res.status(200).send('Review successfully deleted')} 
    else {return res.status(404).json({message: `ISBN ${isbn} not found`})}
})
module.exports.general = public_users;

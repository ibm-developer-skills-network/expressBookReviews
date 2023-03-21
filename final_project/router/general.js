const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

//verifica si el usuario ingresado es correcto o es una cadena vacia
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


public_users.post("/register", (req,res) => {               //TASK 6
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
  
  return res.status(300).json({message: "Yet to be implemented"});
});


/*****************************************************************/

// Get the book list available in the shop              //TASK 10 async
public_users.get('/', async (req, res)  => {

   
    res.send(JSON.stringify(books,null,4));
   

});



/*****************************************************************/
// Get the book list available in the shop              //TASK 1                    

public_users.get('/',function (req, res)  {
  
  res.send(JSON.stringify(books,null,4));               
  //return res.status(300).json({message: "Yet to be implemented"});

});





//******************************************************************************************************** */

// Get book details based on ISBN                       //TASK 2
 public_users.get('/isbn/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;
    res.send(books[isbn]);
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {    //TASK 3
    
    const author = req.params.author;
    let claves=Object.keys(books);
    for (let i in claves)
        {
            res.send(books[claves[i]]);
        }
    res.send(books[author]);
    
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {      //TASK 4
    const title = req.params.title;
    for (let i in claves)
        {
            res.send(books[claves[i]]);
        }
    res.send(books[title]);
    

  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {      //TASK 5
  
  
  const isbn = req.params.isbn;
  const review = req.params.review;
  //const user = req.session.authorization["username"];

  //books[isbn]["reviews"]=review;
  console.log(books[isbn]["reviews"]);
  res.send(isbn + " new review finded!:" + books[isbn]["reviews"]);


  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 });
  
      req.session.authorization = {
        accessToken,username
    } 
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    
    const islbC = req.params.isbn;
    const libros = Object(books[islbC]);
     if (Object.keys(libros).length>0) { 
      let reviewC = req.body.reviews;
       if(reviewC.length>0) 
       {                
                    let dataSet=[]
                    let data
                    let  bandera =true
                    if(Array(libros)[0].reviews.length==undefined)
                    {                    
                       data = {
                        "nombre": req.session.authorization.username,
                        "review": reviewC
                      }
                      dataSet.push(data);
                      //inserta porque es el primero
                     }
                    else
                    { 
                      bandera=true
                      for (let i=0;i<Array(libros)[0].reviews.length;i++)
                      {
                         if(req.session.authorization.username==Array(libros)[0].reviews[i].nombre)
                        {
                         data = {
                            "nombre": req.session.authorization.username,
                            "review": reviewC
                          }
                          dataSet.push(data);
                          bandera=false
                        }
                        else
                        { // no es su reseña
                          data = {
                            "nombre": Array(libros)[0].reviews[i].nombre,
                            "review": Array(libros)[0].reviews[i].review
                          }
                          dataSet.push(data);
                           }
                      }
                      if(bandera)
                      {
                       data = {
                          "nombre": req.session.authorization.username,
                          "review": reviewC
                        }
                        dataSet.push(data);
                        bandera=false
                        //inserta porque es nuevo
                      }
                    }
                     Array(libros)[0].reviews = dataSet
                     books[islbC].reviews=Array(libros)[0].reviews
                     console.log(books[islbC].reviews)
                     console.log("-----------")
                     //res.send(`Book with the isbn  ${islbC} updated. new review ${reviewC}`);
                     return res.send(books[islbC])
                    }
      else
      {
          res.send("Dont update the review is empty!");
      }
      }
  else{
      res.send("Unable to find the book!");
  }

});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const islbC = req.params.isbn;
    const libros = Object(books[islbC]);
     if (Object.keys(libros).length>0) 
     { 
                    let dataSet=[]
                    let data
                    let  bandera =true
                    if(Array(libros)[0].reviews.length==undefined)
                    {                    
                        res.send("Dont delete the list of review is empty!");
                     }
                    else
                    { 
                      bandera=true
                      for (let i=0;i<Array(libros)[0].reviews.length;i++)
                      {
                         if(req.session.authorization.username==Array(libros)[0].reviews[i].nombre)
                        {
                            res.send("delete! "+ Array(libros)[0].reviews[i].review);
                        }
                        else
                        { // no es su reseña
                          data = {
                            "nombre": Array(libros)[0].reviews[i].nombre,
                            "review": Array(libros)[0].reviews[i].review
                          }
                          dataSet.push(data);
                           }
                      }
                    }
                     Array(libros)[0].reviews = dataSet
                     books[islbC].reviews=Array(libros)[0].reviews
                     console.log(books[islbC].reviews)
                     console.log("-----------")
                    return res.send(books[islbC])
       }
  else
      res.send("Unable to find the book!");

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

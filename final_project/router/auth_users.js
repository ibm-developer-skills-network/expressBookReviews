const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {'username': 'Moonknight158', 'password': 'abc123'}, 
  {'username': 'Ray', 'password': 'abc123'}
];

const isValid = (username)=>{ //returns boolean
  for (let user in users) {
    console.log(user);
    if (username === user.username) {
      return true;
    }
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let authUsers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (authUsers.length > 0) {
    return true;
  } else return false;
}

// regd_users.use("/auth/*", function auth(req,res,next){
//   // console.log(JSON.stringify(req.session.authorization) + " OOOOOOOOOOOOOOOOOO")
//   if (req.session.authorization) {
//       jwt.verify(req.session.authorization.accessToken, 'access', (err,user) => {
//           if (!err) {
//               req.user = user;
//               // console.log(JSON.stringify(req.session.authorization) + " ________________");
//               next();
//           } else {
//               return res.status(403).send("User not authenticated!");
//           }
//       });
//   } else {
//       return res.status(403).send("User not logged in");
//   }
// });

//only registered users can login
regd_users.post("/login", (req,res,next) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.send("Please enter both a username and password.");
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 5});
    
    req.session.authorization = {
      accessToken, username
    }

    req.session.save()
    console.log(req.session.id + " login")
    // res.send("Welcome " + username);
    // next();
    res.status(200).send("Welcome " + username);
  } else {
    return res.status(208).json({message: "Invalid Login. Check your username and password."})
  }
});

regd_users.use("/loggedin", (req,res,end) => {
  if (req.session.authorization) console.log(req.session.authorization['username']);
  else console.log(false);
  end();
}) 

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  bookNum = req.params.isbn;
  if (books[bookNum]) {
    if (books[bookNum])
    books[bookNum].reviews.push({ "username": req.session.authorization.username, "review": req.query.review});
    console.log(req.session.id + " review");
    return res.status(300).send("Review Added!");
  } else {
    console.log(req.session.id + " review");
    return res.send("There is no book with the isbn " + bookNum);
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  bookNum = req.params.isbn;
  user = req.session.authorization.username;
  let filteredReview = books[bookNum].reviews.filter((review) => 
      review.username != user);
  books[bookNum].reviews = filteredReview;
  return res.send(user + "'s Review Removed");
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
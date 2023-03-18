const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username: 'user2',
    password: 'pwd2',
},];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const matchingUsers = users.filter(
    user => user.username === username && user.password === password
)
return matchingUsers.length > 0
}

const authenticatedUser = (username,password)=>{ 
    let user = users.filter((user) => {
        return (user.username === username && user.password === password);
      });
    
      return user.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(404).json({message: 'Error logging in'})
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{expiresIn: 60 * 60}
		)

		req.session.authorization = {
			accessToken,
			username,
		}
		return res.status(200).send('User successfully logged in')
	} else {
		return res
			.status(208)
			.json({message: 'Invalid Login. Check username and password'})
	}
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let review = req.query.review;
    let username = req.session.authorization["username"];
    let isbn = req.params.isbn;
    
    books[isbn]["reviews"][username] = {"review": review};
    
    return res.status(200).json({message: "Review Added successfully."});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

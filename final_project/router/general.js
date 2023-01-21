const express = require('express');
let books = require("./booksdb.js");
let bookEnum = require("../enuns/enum_book.js");
let buscarBook = require("../utils/buscarPorFIltroUtil.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

	if(isValid(req.body.username)) {		
		return res.status(404).json({message: "Campos username não atende requisitos minimos de 6 digitos!"});
	}
  
	if (username && password) {
	  if (!doesExist(username)) { 
		users.push({"username":username,"password":password});
		return res.status(200).json({message: "Usuário registrado com sucesso!"});
	  } else {
		return res.status(404).json({message: "Usuário ja existe!"});    
	  }
	} 

	if(username == null || password == null) {
		return res.status(404).json({message: "Campos username e password não pode ser nulos!"});
	}
	return res.status(404).json({message: "Não foi possível registrar o usuário!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
	const isbn = req.params.isbn;
	var result = buscarBook.echo(books, bookEnum.isbn.key, isbn);
	if(result == null) {
		result = "O Livro com o isbn:"+isbn+" não foi encontrado!!";
	}
	res.send(result);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
	const author = req.params.author;
	var result = buscarBook.echo(books, bookEnum.author.key, author);
	if(result == null) {
		result = "O Livro com o author:"+author+" não foi encontrado!!";
	}
	res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
	const title = req.params.title;
	var result = buscarBook.echo(books, bookEnum.title.key, title);
	if(result == null) {
		result = "O Livro com o titulo:"+title+" não foi encontrado!!";
	}
	res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
	const isbn = req.params.isbn;
	var result = buscarBook.echo(books, bookEnum.isbn.key, isbn);
	if(result == null) {
		result = "O Livro com o isbn:"+isbn+" não foi encontrado!!";
	}
	res.send(result);
});

module.exports.general = public_users;

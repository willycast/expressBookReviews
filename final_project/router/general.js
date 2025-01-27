const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// TASK 6 Registering a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send('Please complete all fields');
  }
  
  if (!isValid(username)) {
    return res.status(409).send('Username not valid');
  }

  users.push({username: username, password: password});
  return res.status(200).send(`User ${username} successfully registered`);
});

// TASK 1 Get the book list available in the shop
public_users.get('/',function (req, res) {
  if(books.length == 0) {
    return res.status(404).send('There is no books');
  }
  return res.status(200).send(books);
});

// TASK 2 Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn]);
  }
  else {
    return res.status(404).send('There is no book with ISBN ' + isbn);
  }
});

// TASK 3 Get book details based on author using
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  let filteredBooks = [];
  let booksKeys = Object.keys(books);
    
  for (let i = 1; i <= booksKeys.length; i++) {
    if(books[i].author === author){
      filteredBooks.push(books[i]);
    }
  }

  if (filteredBooks.length != 0) {
    return res.status(200).send(filteredBooks);
  } else {
    return res.status(404).send('There is no book with author ' + author);
  }
});

// TASK 4 Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  let filteredBooks = [];
  let booksKeys = Object.keys(books);
    
  for (let i = 1; i <= booksKeys.length; i++) {
    if(books[i].title === title){
      filteredBooks.push(books[i]);
    }
  }

  if (filteredBooks.length != 0) {
    return res.status(200).send(filteredBooks);
  } else {
    return res.status(404).send('There is no book with title ' + title);
  } 
});

// TASK 5 Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if(books[isbn]) {
    return res.status(200).send(books[isbn].reviews);
  } else {
    return res.status(404).send('There is no book with ISBN ' + isbn);
  }
});

module.exports.general = public_users;

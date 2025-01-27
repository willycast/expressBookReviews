const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let filteredUser = users.filter((user) => user.username === username);
  if (filteredUser.length != 0) {
    return false;
  }
  else {
    return true;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let filteredUser = users.filter((user) => user.username === username && user.password === password);
  if (filteredUser.length > 0) {
    return true;
  } 
  else {
    return false;
  }
}

//TASK 7 only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send('Please complete all fields');
  }

  if(!authenticatedUser) {
    return res.status(404).send('Credentials Invalid');
  }

  let accessToken = jwt.sign({
    password: password
  }, 'access', { expiresIn: 60 * 60 });

  req.session.authorization = {
      accessToken, username
  }

  return res.status(200).send("User successfully logged in");
});

//TASK 8 Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  let filteredBook = books[isbn];
  if (filteredBook) {
    const review = req.query.review;
    if (review) {
      const reviewer = req.session.authorization['username']; 
      filteredBook.reviews[reviewer] = review;
      books[isbn] = filteredBook;
      return res.status(200).send(`Review for the book with ISBN ${isbn} added`);
    }
    else {
      return res.status(400).send('Please write a review');
    }
  }
  else {
    return res.status(404).send('There is no book with ISBN ' + isbn);
  }
});

//TASK 9 Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  let filteredBook = books[isbn];
  if (filteredBook) {
    const reviewer = req.session.authorization['username'];
    if (filteredBook.reviews[reviewer]) { 
      delete filteredBook.reviews[reviewer];
      return res.status(200).send(`Reviews for the book with ISBN ${isbn} by user ${reviewer} deleted`);
    }
    else {
      return res.status(400).send('You can not delete any reviews');
    }
  }
  else {
    return res.status(404).send('There is no book with ISBN ' + isbn);
  } 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

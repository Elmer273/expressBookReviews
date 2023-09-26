const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const filteredUsers = users.filter(user => user.username === username);
    return filteredUsers.length === 0 ? true : false; 
}

const authenticatedUser = (username,password)=>{
    const filteredUser = users.filter(user => user.username === username && user.password === password);
    return filteredUser.length === 1 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(!username || !password) {
    return res.status(404).json({message: "Please provide your credentials"});
  }

  if(authenticatedUser(username, password)) {
      const accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60});
      req.session.authorization = { accessToken,username };
      return res.status(200).json({message: "User successfully logged in"});
  } else {
      return res.status(408).json({message: "Unable to login"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const currentUser = req.session.authorization['username'];
  
  books[isbn].reviews[currentUser] = review;
  return res.status(200).json({message: "Review has been posted"});
});

//Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const currentUser = req.session.authorization['username'];
    delete books[isbn].reviews[currentUser];
    return res.status(200).json({message: "Review has been deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

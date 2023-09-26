const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const URL = "https://<username>-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai";

public_users.post("/register", (req,res) => {
  const {username, password} = req.body;
  if(!username || !password) {
      res.status(404).json({message: "Please provide your credentials"});
  } 

  if(isValid(username)) {
    users.push({username: username, password: password});
    return res.status(200).json({message: "User successfully added"});
  } else {
    return res.status(404).json({message: "User already exists"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// (Async-await) Get the book list available in the shop
async function getBookList(){
    try {
        const response = await axios.get(URL + '/');
        console.log(response.data);
        return(response.data);
    } catch (error) {
        console.error(error);
    }
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn} = req.params;
  return res.status(200).json(books[isbn]);
});

// (Async-await) Get book details based on ISBN
async function getBookByIsbn(isbn){
    try {
        const response = await axios.get(URL +'/isbn/' +isbn);
        console.log(response.data);
        return(response.data);
    } catch (error) {
        console.error(error);
    }
}
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params;
  const filteredBooks = Object.fromEntries(
    Object.entries(books).filter(
        ([key, value]) => value.author === author));
  return res.status(200).json(filteredBooks);
});

// (Async-await) Get book details based on author
async function getBookByAuthor(author){
    try {
        const response = await axios.get(URL +'/author/' +author);
        console.log(response.data);
        return(response.data);
    } catch (error) {
        console.error(error);
    }
}

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params;
  const filteredBooks = Object.fromEntries(
    Object.entries(books).filter(
        ([key, value]) => value.title === title));
  return res.status(200).json(filteredBooks);
});

// (Async-await) Get book details based on title
async function getBookByTitle(title){
    try {
        const response = await axios.get(URL +'/title/' +title);
        console.log(response.data);
        return(response.data);
    } catch (error) {
        console.error(error);
    }
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params;
  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
module.exports.getBookList = getBookList;
module.exports.getBookByIsbn = getBookByIsbn;
module.exports.getBookByAuthor = getBookByAuthor;
module.exports.getBookByTitle = getBookByTitle;

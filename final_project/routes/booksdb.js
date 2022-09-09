const express = require('express');
const router = express.Router();

let books = [
    {
      "isbn": 1,
      "author": "Chinua Achebe",
      "title": "Things Fall Apart",
      "review": "Good"
    },
    {
      "isbn": 2,
      "author": "Hans Christian Andersen",
      "title": "Fairy tales",
      "review": "Good"
    },
    {
      "isbn": 3,
      "author": "Dante Alighieri",
      "title": "The Divine Comedy",
      "review": "Good"
    },
    {
      "isbn": 4,
      "author": "Unknown",
      "title": "The Epic Of Gilgamesh",
      "review": "Good"
    },
    {
      "isbn": 5,
      "author": "Unknown",
      "title": "The Book Of Job",
      "review": "Good"
    },
    {
      "isbn": 6,
      "author": "Unknown",
      "title": "One Thousand and One Nights",
      "review": "Good"
    },
    {
      "isbn": 7,
      "author": "Unknown",
      "title": "Nj\u00e1l's Saga",
      "review": "Good"
    },
    {
      "isbn": 8,
      "author": "Jane Austen",
      "title": "Pride and Prejudice",
      "review": "Good"
    },
    {
      "isbn": 9,
      "author": "Honor\u00e9 de Balzac",
      "title": "Le P\u00e8re Goriot",
      "review": "Good"
    },
    {
      "isbn": 10,
      "author": "Samuel Beckett",
      "title": "Molloy, Malone Dies, The Unnamable, the trilogy",
      "review": "Good"
    }
]

module.exports=books;


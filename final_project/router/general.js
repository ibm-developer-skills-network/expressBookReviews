const express = require('express');
const axios = require('axios'); // Import Axios
const public_users = express.Router();

// Function to get the list of books available in the shop using Axios and Async-Await
const getBookList = async () => {
  try {
    const response = await axios.get('https://marekmarkiew-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/'); // Replace with your actual API URL
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const bookList = await getBookList();
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports.general = public_users;

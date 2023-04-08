const axios = require("axios");

const getListBooks = async () => {
  const res = await axios.get("http://localhost:5000");
  console.log(res.data);
};

const getBookBaseISBN = async (isbn) => {
  const res = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  console.log(res.data);
};

const getBookBaseAuthor = async (author) => {
  const res = await axios.get(`http://localhost:5000/author/${author}`);
  console.log(res.data);
};

const getBookBaseTitle = async (title) => {
  const res = await axios.get(`http://localhost:5000/title/${title}`);
  console.log(res.data);
};

getListBooks();
getBookBaseISBN(1);
getBookBaseAuthor("Dante Alighieri");
getBookBaseTitle("Fairy tales");

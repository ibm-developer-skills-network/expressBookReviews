const bcrypt = require("bcrypt");
const hashData = async (data) => {
  try {
    const hashedData = bcrypt.hash(data, 10);
    return hashedData;
  } catch (error) {
    throw new Error("error in hashing the data");
  }
};

module.exports = hashData;
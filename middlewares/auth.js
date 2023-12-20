const { StatusCodes } = require("http-status-codes");
const auth = (req, res, next) => {
  if (req.session.authorization) {
    const { accessToken } = req.session.authorization;
    console.log("accesstoken", accessToken);
    
    next();
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({ msg: "user not logged in" });
  }
};

module.exports = auth;

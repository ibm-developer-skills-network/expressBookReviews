const express = require("express");
const app = express();
const customerRoute = require("./routes/customer");
const vendorRoute = require("./routes/vendor");
const cors = require("cors");


app.use(cors());
app.use(express.json());
app.use("/api/customer", customerRoute);
app.use("/api/vendor", vendorRoute);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

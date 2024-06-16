const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/e-comm";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

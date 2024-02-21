const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://digvijaysingh8116:Mobiloitte1@cluster0.hv2anhk.mongodb.net/E-comm?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },

    otp: String,
  },
  { timestamps: true }
);
userSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("users", userSchema);
//here users is the collection  that is defined inside the data base  here it is not the name of the folder

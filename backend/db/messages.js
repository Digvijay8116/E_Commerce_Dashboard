const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message:String,
  img: String,
},{timestamps:true});

module.exports = mongoose.model('Messages',messageSchema)
const mongoose = require('mongoose');

const teaSchema = new mongoose.Schema({
    name:String,
    email:String,
    username:String,
    password:String,
});

const dbcollaction = mongoose.model("userdetails",teaSchema)
module.exports = dbcollaction
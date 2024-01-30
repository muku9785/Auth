const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost:27017/pint-database", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});
const userschema = mongoose.Schema({
  username: String,
  password: String,
});

userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userschema);

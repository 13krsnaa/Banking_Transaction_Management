const mongoose = require("mongoose");

function connectToDB() {
  console.log("DB function called");
  mongoose
    .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("server is connected to the DataBase");
    })
    .catch((err) => {
      console.log("Error, Connecting to the DB");
      console.log(err);
      process.exit(1);
    });
}

module.exports = connectToDB;

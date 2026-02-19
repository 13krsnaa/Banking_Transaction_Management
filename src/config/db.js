const mongoose = require("mongoose");

function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("server is connected to the DataBase");
    })
    .catch((err) => {
      console.log("Error, Connecting to the DB");
      process.exit(1);
    });
}

module.exports = connectToDB;

const mongoose = require("mongoose")

function connectToDb () {
    mongoose.connect(process.env.MONGO_URI)
    .then (()=> {
        console.log("Connected to Database")
    })
    .catch((err) => {
        console.log(err)
        process.exit(1) // agar server db se connect nhi hua to server yhi band ho jayega
    });
}



module.exports = connectToDb
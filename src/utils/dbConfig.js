const mongoose = require("mongoose")
require("dotenv").config();

async function connect(){
    const dbUri = process.env.MONGODB_URL
    try{
        await mongoose.connect(dbUri)
        console.log("Database connected")
    }catch(err){
        console.log("Error connecting to database")
        console.log(err)
        process.exit(1)
    }
}

module.exports = connect

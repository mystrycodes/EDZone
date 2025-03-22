import mongoose from "mongoose";


// Connecting to the database

const connectDB = async () =>{
    mongoose.connection.on('connected',()=>console.log("database connected"));
    await mongoose.connect(`${process.env.MONGODB_URI}/EDZone`)
};

export default connectDB;
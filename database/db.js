import mongoose from "mongoose"


const connectDB = async() => {
    try{ 
        await mongoose.connect(`${process.env.MONGO_URI}/taskflow-app`)
        console.log('MongoDB connection successfully..')
    }catch(err){
        console.log('MongoDB Connection Failed!!')
    }
}

export default connectDB;
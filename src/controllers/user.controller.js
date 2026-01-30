import validator from 'validator';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

const JWT_SECRET = process.env.JWT_SECRET

const createToken = async(userId) => {
    return jwt.sign({id: userId}, JWT_SECRET, {expiresIn: '24h'})
}



const registerUser = async(req, res) => {
    const {name, email, password} = req.body;

    // validation all fields
    if(!name || !email || !password){
        return res.status(400).res.json({
            success: false,
            message: 'All field are required'
        })
    }
    // Email Validate
    if(!validator.isEmail(email)){
        return res.status(400).res.json({success:false, message: 'Invalid Email'})
    }

    // password validate
    if(password.length < 8){
         return res.status(409).res.json({success:false, message: 'Password must be at least 8 character'})
    }

    // try catch
    try{
        const userEmail = await User.findOne({email})
        if(userEmail){
           return res.status(409).json({success: false, message: "user Already exits"})
        }
        // password hashed
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword}) 
        // token 
        const token = createToken(user._id)

        return res.status(201).json({
            success: true, 
            message: 'User Created Successfully', 
            token, 
            user: {
                id: user._id, 
                name: user.name, 
                email: user.email
            }})


    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Server Error! Something went wrong!!!'
        })
    }

}

module.exports = {
    registerUser
}
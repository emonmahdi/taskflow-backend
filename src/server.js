import express from 'express'
import dotenv from 'dotenv' 
import connectDB from '../database/db.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 


// middleware 
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Taskflow backend Server ')
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running the port ${PORT}`)
})


import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks } from './coontrollers/webhooks.js'


// Initializing express
const app = express()

// Connecting to DB
await connectDB()

// Middlewares
app.use(cors())

// Routes
app.get('/',(req, res)=>res.send("API Working"))
app.post('/clerk', express.json(), clerkWebhooks)

// Ports
const PORT = process.env.PORT || 5000

// Starting the server
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})
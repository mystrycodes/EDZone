import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './coontrollers/webhooks.js'
import instructorRouter from './routes/instructorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoutes.js'
import userRouter from './routes/userRoutes.js'


// Initializing express
const app = express()

// Connecting to DB
await connectDB()
await connectCloudinary()

// Middlewares
app.use(cors())
app.use(clerkMiddleware())

// Routes
app.get('/',(req, res)=>res.send("API Working"))
app.post('/clerk', express.json(), clerkWebhooks)
app.use('/api/instructor', express.json(), instructorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.use('/stripe', express.raw({type:'application/json'}), stripeWebhooks)

// Ports
const PORT = process.env.PORT || 5000

// Starting the server
app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})
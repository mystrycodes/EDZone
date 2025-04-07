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
import healthRouter from './routes/health.js'

// Initializing express
const app = express()

// Basic middleware
app.use(cors())
app.use(express.json())

// Connecting to DB
if (process.env.NODE_ENV !== 'test') {
  await connectDB()
  await connectCloudinary()
}

// Clerk middleware (skip in test environment)
if (process.env.NODE_ENV !== 'test') {
  app.use(clerkMiddleware())
}

// Routes
app.get('/',(req, res)=>res.send("API Working"))
app.post('/clerk', clerkWebhooks)
app.use('/api', healthRouter)
app.use('/api/instructor', instructorRouter)
app.use('/api/course', courseRouter)
app.use('/api/user', userRouter)
app.use('/stripe', express.raw({type:'application/json'}), stripeWebhooks)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

// Ports
const PORT = process.env.PORT || 5000

// Starting the server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, ()=>{
      console.log(`server is running on port ${PORT}`)
  })
}

export { app };
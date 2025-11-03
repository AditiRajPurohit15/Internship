require('dotenv').config()
const express = require("express")
const cookieParser = require('cookie-parser')
const cacheInstance = require('./src/services/cache.service')
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes')
const adminRoutes = require('./src/routes/admin.routes')
const path = require("path")

const app = express()

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

connectDB()
app.use(cookieParser());


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/admin',adminRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, ()=>{
    `Server is runnning on Port ${PORT} `
})
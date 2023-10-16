import express from 'express'
import dotenv from 'dotenv'
import mongoose, { mongo } from 'mongoose'
import router from './routers.js'
dotenv.config()

const PORT = process.env.PORT || 3000
const connString = process.env.CONNECTION_STRING 
const app = express()

app.use(express.json())
app.use('/user',router)

app.get('/',(req,res)=>{
    res.status(200).json('hello user!')
    
})

const startServer = async () => {
    try{
        await mongoose.connect(connString)
        app.listen(PORT, ()=>{
            console.log(`Server started at port: ${PORT}`)
        })
    }catch(e){
        console.log(e)
    }
}

startServer()
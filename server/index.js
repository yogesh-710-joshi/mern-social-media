import express from 'express'
import bodyPraser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import  {fileURLToPath} from 'url'
import bodyParser from 'body-parser'
import authRoutes from './routes/auth.js'

import {register} from './controllers/auth.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config()
const app = express()
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy: 'cross-origin'}))
app.use(morgan('common'))
app.use(bodyParser.json({limit: '30mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '30mb', extended: true}))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '/public/assets')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({storage})

app.post('/auth/register', upload.single('picture'), register)
app.use('/auth', authRoutes)

function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500
    const message = err.message || 'Internal Server Error'
    console.log('error handler')
    res.status(statusCode).json({error: message})
}

app.use(errorHandler)

const port = process.env.PORT || 3001
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    app.listen(port, ()=> console.log(`Server running at port ${port}`))
}).catch((err) => {
    console.log(`${err} did not connect`)
})
setTimeout(()=> console.log('a'))
setImmediate(
    ()=>{
        setTimeout(()=> console.log('b'))
        console.log('c')
    })
setImmediate(()=> console.log('d'))
process.nextTick(()=> console.log('e'))
console.log('f')

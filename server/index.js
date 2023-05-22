import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
// middleware for handling multipart/form-data, which is primarily used for uploading files
import multer from 'multer';
// Helmet helps secure Express apps by setting HTTP response headers.
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { register } from './controllers/auth.js';
import  authRoutes from './routes/auth.js'
import userRoutes from "./routes/users.js" 
import { verifyToken } from './middleware/auth.js';

// configuration 
// when type is module we can access filepath in this way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

// file storage
// this way we can save file
const storage = multer.diskStorage({
    //anyone will come to this website than file will save in this public/assets destination
    destination: function (req, file, cb) {
        cb(null, 'public/assets')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

//   anytime need to upload the file we can use this variable
const upload = multer({ storage })


// this is meddleware function which will run before it hit the input

// routes with files
app.post("/auth/register", upload.single("picture"), register);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
// mongoose setup
const PORT = process.env.PORT || 6000;
mongoose.connect(process.env.MONGO_URL, {
    useNewurlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`server is running on ${PORT}`)
    })
}).catch((error) => {
    console.log(`${error}`)
})
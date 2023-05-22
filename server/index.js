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
  const upload = multer({storage})


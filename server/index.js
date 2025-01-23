
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import util from'util';
import UserModel from './models/user.js'; // Adjusted import
import multer from 'multer';
import { exec } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
import axios from 'axios';
import fileUpload from 'express-fileupload';
import FormData from 'form-data';
dotenv.config();  

// const path = require('path');
const app = express();
const UPLOADS_FOLDER = 'C:\\MERNStackApplication\\artvise\\server\\uploads\\'


// Ensure the uploads directory exists 
if (!fs.existsSync(UPLOADS_FOLDER)) { fs.mkdirSync(UPLOADS_FOLDER, { recursive: true }); } 

// Configure multer to use the absolute path for uploads 
const storage = multer.diskStorage({ 
    destination: (req, file, cb) => 
        { cb(null, UPLOADS_FOLDER); },
     filename: (req, file, cb) =>
         { cb(null, file.originalname); } }); 

const upload = multer({ storage: storage });


app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:5173', // Allow only this origin
    methods: 'GET,POST', // Allow only these methods
    allowedHeaders: 'Content-Type,Authorization' // Allow only these headers
  };
app.use(cors(corsOptions));
  
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});


// Login endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
    .then(user => {
        if(user){
            if(user.password === password) {
                res.json("Successful");
            } else {
                res.json("Incorrect Password");
            }
        } else {
            res.json("Invalid email, account is not registered");
        }
    })
    .catch(err => res.json(err));
});

// Register endpoint
/*
app.post('/register', (req, res) => {
    // req.body contains the data inputted from the frontend
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err));
});

// Fetch user name endpoint
app.get('/user', (req, res) => {s
    UserModel.findOne({}, 'name', (err, user) => {
        if (err) {
            console.error('Error fetching user:', err); // Log the error
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});*/

//IN PROGRESS
//Saves in the uploads folder

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    console.log(`File saved at: ${filePath}`);

    // Extract colors by calling Flask API
    const flaskApiUrl = 'http://localhost:5000/upload';
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    axios.post(flaskApiUrl, formData, {
        headers: formData.getHeaders()
    })
    .then(response => {
        const colors = response.data.colors;
        console.log(`Extracted colors: ${JSON.stringify(colors)}`);
        res.json({ colors });
    })
    .catch(error => {
        console.error(`Error extracting colors: ${error}`);
        if (error.response) {
            // Server responded with a status code that falls out of the range of 2xx
            console.error(`Error response data: ${JSON.stringify(error.response.data)}`);
            console.error(`Error response status: ${error.response.status}`);
            console.error(`Error response headers: ${JSON.stringify(error.response.headers)}`);
        } else if (error.request) {
            // Request was made but no response was received
            console.error(`Error request: ${util.inspect(error.request, { depth: null })}`); // Improved logging
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error(`Error message: ${error.message}`);
        }
        res.status(500).json({ error: 'Error extracting colors' });
    });
});

{/*
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    console.log(`File saved at: ${filePath}`);

    // Extract colors
    const pythonScriptPath = 'C:\\MERNStackApplication\\artvise\\server\\scripts\\color_extractor.py';
    const command = `python ${pythonScriptPath} ${filePath.replace(/\\/g, '/')}`;

    console.log(`Executing command: ${command}`);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec error: ${error}`);
            console.error(`stderr: ${stderr}`);
            return res.status(500).json({ error: 'Error extracting colors' });
        }

        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        try {
            const colors = JSON.parse(stdout.trim());
            console.log(`Extracted colors: ${JSON.stringify(colors)}`);
            res.json({ colors });
        } catch (parseError) {
            console.error(`Parse error: ${parseError}`);
            return res.status(500).json({ error: 'Error parsing colors' });
        }
    });
});
*/}


// Upload and classify image endpoint
/*
app.post('/upload', upload.single('file'), (req, res) => {
    const filePath = req.file.path;
    exec(`python scripts/color_extractor.py ${filePath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: 'Error extracting colors' });
        }

        const colors = JSON.parse(stdout.trim());
        console.log(req.file); // To ensure the file is received
        console.log(colors);   // To log the extracted colors before sending response

        res.json({ colors });

        // Clean up the uploaded file
        // fs.unlinkSync(filePath);
    });
});*/

const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


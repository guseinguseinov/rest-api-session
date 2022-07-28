import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import dotenv from 'dotenv';
import UserModel from '../models/user.js ';
import SessionModel from "../models/session.js";

dotenv.config();
const SALT = process.env.SALT_SECRET || "YOUR SALT SECRET";


function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
        return;
    }
    cb(new Error('invalid file mimetype'));
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const userRoute = express.Router();
const upload = multer({ storage, fileFilter});

userRoute.post('/register', upload.single('image'), async (req, res) => {
    const { firstName, lastName, email, password, image } = req.body;
    const { path } = req.file;
    const userEmail = await UserModel.findOne({ email });
    if (userEmail) {
        res.status(409).json({
            message: 'User already exsists'
        });
        return;
    }
    const newUser = new UserModel({
        firstName, 
        lastName, 
        email, 
        password,
        image: path,
    });

    await newUser.save();
    res.status(201).send('ok');
});


userRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = crypto.
        pbkdf2Sync(password, SALT, 100000, 64, 'sha512')
        .toString('hex');
    
    const userData = await UserModel.findOne({ email, password: hashedPassword });
    const accessToken = crypto.randomBytes(32).toString('base64');
    const newSession = new SessionModel({
        user: userData._id,
        accessToken,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    });

    await newSession.save();

    if (userData) {
        res.status(200)
            .json({ accessToken });
    }else {
        res.status(401).send({
            message:"Username or password is not defined",
        });
    }

});


export default userRoute;
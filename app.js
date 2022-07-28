import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute.js';

const app = express();

await mongoose.connect('mongodb://localhost/sessions');

app.use(express.urlencoded());
app.use(express.json());
app.use('/public', express.static(path.resolve('public')));
app.use('/users', userRoute);

export default app;
import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const SALT = process.env.SALT_SECRET || "YOUR SALT SECRET";

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  image: String,
});

UserSchema.pre('save', function (next) {
  this.password = crypto
    .pbkdf2Sync(this.password, SALT, 100000, 64, 'sha512')
    .toString('hex');
  next();
});

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;
import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    user: {
        type: "ObjectId",
        ref: "users",
    },
    accessToken: String,
    expiresAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const SessionModel = mongoose.model('sessions', sessionSchema);

export default SessionModel;
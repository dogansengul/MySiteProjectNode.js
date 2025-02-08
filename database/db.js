import mongoose from 'mongoose';

export const dbConnect = function () {
    mongoose.connect('mongodb://127.0.0.1:27017/mySite', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

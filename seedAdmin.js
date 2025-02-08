import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcrypt';

async function seedAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/mySite');

        const adminExists = await User.findOne({
            email: 'kaandogan2013@gmail.com',
        });
        if (!adminExists) {
            //const hashed = await bcrypt.hash('12345', 10);
            await User.create({
                email: 'kaandogan2013@gmail.com',
                password: '12345',
                role: 'admin',
            });
            console.log('Admin user created!');
        } else {
            console.log('Admin already exists!');
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seedAdmin();

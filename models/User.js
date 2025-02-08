import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; // Şifre hash kontrolü

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'user', // 'admin' vs.
    },
});

// Kaydetmeden önce şifreyi hash’le
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            // Şifre alanı değişmemişse devam
            return next();
        }
        const hashed = await bcrypt.hash(this.password, 10);
        this.password = hashed;
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

export default User;

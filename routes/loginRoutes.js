// routes/loginRoutes.js
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const router = express.Router();

router.get('/', (req, res) => {
    // login formu
    res.render('login'); // views/login.ejs
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);
        // 1) Kullanıcı var mı?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Kullanıcı bulunamadı');
        }

        // 2) Şifre eşleşmesi
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).send('Şifre hatalı');
        }

        // 3) Session'a kullanıcıyı kaydet
        req.session.userId = user._id;
        req.session.isAdmin = user.role === 'admin'; // admin mi?

        // 4) Yönlendir
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Sunucu hatası');
    }
});

export default router;

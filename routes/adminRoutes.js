import express from 'express';
import Photo from '../models/Photo.js';
import multer from 'multer';
import path from 'path';

import { isAdmin } from '../middlewares/admin.js';

const router = express.Router();

// 1) Multer storage ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Fotoğraflar nereye kaydedilecek?
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        // Dosya adı nasıl oluşturulsun?
        // (Örn: özgün olması için Date.now() + uzantı)
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

// 2) upload middleware'ini oluştur
const upload = multer({ storage: storage });

router.get('/addphoto', isAdmin, (req, res) => {
    // Admin kontrolü ekleyebilirsin (örn: oturum doğrulama), burada örneğe dahil edilmedi.
    res.render('addphoto', { title: 'Fotoğraf Ekle' });
});

router.post('/addphoto', isAdmin, (req, res) => {
    // Admin kontrolü ekleyebilirsin (örn: oturum doğrulama), burada örneğe dahil edilmedi.
});

router.post(
    '/photos',
    isAdmin,
    upload.single('photo'),
    async (req, res, next) => {
        // Artık req.body ve req.file üzerinden verilerinize erişebilirsiniz
        console.log(req.body); // { title: '...', description: '...' }
        console.log(req.file); // { fieldname, originalname, mimetype, ... }

        // Eğer resmi base64 veya file path olarak kaydetmek istiyorsanız buradan işlem yapabilirsiniz.
        // Örnek olarak sadece metin verilerini Photo modeline kaydedebilirsiniz:
        try {
            // Dosya sisteme kaydedildi. Veritabanına ise sadece dosya yolunu kaydedelim.
            // (req.file.filename -> diskStorage içinde ürettiğimiz isim)
            // Resim yolunu "/uploads/..." formatında kaydedersek,
            // <img src="/uploads/dosya.jpg"> şeklinde erişebiliriz.
            const imagePath = '/uploads/' + req.file.filename;

            const createdPhoto = await Photo.create({
                title: req.body.title,
                description: req.body.description,
                image: imagePath,
            });

            console.log('Fotoğraf kaydedildi:', createdPhoto);
            res.redirect('/');
        } catch (err) {
            console.error(err);
            next(err);
        }
    }
);

export default router;

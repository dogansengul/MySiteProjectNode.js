import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';
import session from 'express-session';
import MongoStore from 'connect-mongo'; // eğer mongodb tabanlı bir oturum saklama isterseniz

import adminRouter from './routes/adminRoutes.js';
import loginRouter from './routes/loginRoutes.js';
import { dbConnect } from './database/db.js';
import Photo from './models/Photo.js';

const { PORT, ADMIN_KEY, MONGO_URL } = process.env;
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const app = express();

dbConnect();

app.set('view engine', 'ejs');
app.set('views', path.join(dirName, 'views'));

app.use(
    session({
        secret: ADMIN_KEY,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
        }),
    })
);
app.use((req, res, next) => {
    // Eğer oturum açılmışsa req.session.isAdmin değeri var, yoksa false
    res.locals.isAdmin = req.session.isAdmin || false;
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const loggerWithPrefix = (prefix) => {
    return function (req, res, next) {
        console.log(`${prefix}: Method: ${req.method}, Url: ${req.url}`);
        next();
    };
};

let reqTime = null;
let resTime = null;

const requestTime = (req, res, next) => {
    const dateNow = Date.now();
    reqTime = dateNow;
    req.requestTime = dateNow;
    next();
};

app.use(requestTime);
app.use('/', loggerWithPrefix('Info about request'));

app.use('/admin', adminRouter);
app.use('/login', loginRouter);

app.get('/about', (req, res) => {
    // Dinamik içerik için örnek veriler
    const aboutData = {
        name: 'Doğan Şengül',
        title: 'About Me',
        bio: 'Merhaba! Ben Doğan. Backend ve yazılım geliştirme üzerine tutkulu biriyim. Projeler geliştiriyor, açık kaynak dünyasında aktif rol alıyorum.',
        skills: ['JavaScript', 'Node.js', 'Express', 'Android', 'Kotlin'],
    };
    // 'about.ejs' şablonunu render et ve aboutData verilerini aktar
    res.render('about', { aboutData });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Çıkış yapılamadı');
        }
        res.redirect('/'); // Oturum kapandıktan sonra ana sayfaya yönlendir
    });
});

app.get('/', async (req, res, next) => {
    const dateNow = Date.now();
    resTime = dateNow;
    const homeData = {
        title: 'Home Page',
        requestTime: reqTime,
        responseTime: resTime,
        difference: resTime - reqTime,
        isAdmin: req.session.isAdmin,
    };
    // Mongoose ile tüm fotoğrafları alalım
    const photos = await Photo.find({});

    // home.ejs dosyasına homeData ile beraber photos dizisini de gönderiyoruz.
    res.render('home', { homeData, photos });
    //res.status(200).render('home', { homeData });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

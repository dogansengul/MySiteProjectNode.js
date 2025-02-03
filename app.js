import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import ejs from 'ejs';

const { PORT } = process.env;
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(dirName, 'views'));

app.use(express.static('public'));

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

app.get('/about', (req, res) => {
    // Dinamik içerik için örnek veriler
    const aboutData = {
        name: 'Doğan Şengül',
        title: 'Yazılım Geliştirici',
        bio: 'Merhaba! Ben Doğan. Backend ve yazılım geliştirme üzerine tutkulu biriyim. Projeler geliştiriyor, açık kaynak dünyasında aktif rol alıyorum.',
        skills: ['JavaScript', 'Node.js', 'Express', 'Android', 'Kotlin'],
    };
    // 'about.ejs' şablonunu render et ve aboutData verilerini aktar
    res.render('about', { aboutData });
});

app.use('/', loggerWithPrefix('Info about request'));

app.get('/', (req, res, next) => {
    const dateNow = Date.now();
    resTime = dateNow;
    const homeData = {
        title: 'HOME PAGE',
        requestTime: reqTime,
        responseTime: resTime,
        difference: resTime - reqTime,
    };
    //res.status(200).sendFile(path.resolve(dirName, 'public/img/about-1.jpg'));
    //res.setHeader('Content-Type', 'text/plain');
    /*
    res.status(200).send(
        `Request Time: ${reqTime}, Response Time: ${resTime}, Difference: ${resTime - reqTime} \nHello from the main page!`
    );*/
    res.status(200).render('home', { homeData });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

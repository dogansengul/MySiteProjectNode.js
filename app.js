import express from 'express';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const { PORT } = process.env;
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const app = express();

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

app.use('/', loggerWithPrefix('Info about request'));

app.get('/', (req, res, next) => {
    const dateNow = Date.now();
    resTime = dateNow;
    res.status(200).sendFile(path.resolve(dirName, 'public/img/about-1.jpg'));
    /*
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(
        `Request Time: ${reqTime}, Response Time: ${resTime}, Difference: ${resTime - reqTime} \nHello from the main page!`
    );
    */
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

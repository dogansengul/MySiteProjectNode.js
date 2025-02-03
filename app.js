import express from 'express';
import 'dotenv/config';

const { PORT } = process.env;

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
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(
        `Request Time: ${reqTime}, Response Time: ${resTime}, Difference: ${resTime - reqTime} \nHello from the main page!`
    );
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

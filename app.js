import express from 'express';
import 'dotenv/config';

const { PORT } = process.env;

const app = express();

app.use('/', (req, res, next) => {
  console.log(req.method, req.url);
  res.status(200).send('Hey');
  next();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

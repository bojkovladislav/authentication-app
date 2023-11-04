import express from 'express';
import 'dotenv/config';
import { authRouter } from './routes/auth.router.js';
import cors from 'cors';

const PORT = process.env.PORT || 3005;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: true,
  })
);
app.use(express.json());
app.use(authRouter);

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(PORT);

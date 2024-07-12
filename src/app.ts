import 'express-async-errors';
import "reflect-metadata";
import 'dotenv/config';
import express from "express";
import { json } from "body-parser";
import cors from 'cors';
import morgan from 'morgan';

import { errorHandler } from './middleware/errorHandler';
import { tokenRouter } from './routes/token';
import { NotFoundError } from './middleware/errors/not-found-error';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(morgan('combined'))

app.use(cors({
  origin: "*",
  allowedHeaders: ["content-type"],
  credentials: true,
}));

app.use('/api/v1', tokenRouter);

app.use('*', async () => {
  throw new NotFoundError();
})

app.use(errorHandler);

export { app };

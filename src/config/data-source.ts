import mongoose from 'mongoose';
import { BadRequestError } from '../middleware/errors/bad-request-error';

const connect = async () => {
  console.log('Connecting to DB.....')
  if(!process.env.DBURL) {
    throw new BadRequestError('DB URL is required.');
  }

  await mongoose.connect(process.env.DBURL!);
}

export  { connect as mongoConnection };
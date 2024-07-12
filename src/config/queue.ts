import { Queue, Worker } from 'bullmq';
import { UnUsedToken, UsedToken } from '../models/token';

const connectionObject = {
  host: String(process.env.REDIS_HOST),
  port: Number(process.env.REDIS_PORT),
}

const assignedTokenQueue = new Queue('assigned-token', { connection: connectionObject });

// You can have as many worker processes as you want,
// BullMQ will distribute the jobs across your workers in a round robin fashion.
const worker = new Worker('assigned-token', async job => {
  const token = await UsedToken.findById(job.data.tokenId).lean();

  if(!token) {
    console.log('Either token is un-assigned or deleted.');
    return {};
  }

  // if lastupdatedAt field is greater then 60s then free the token
  const updateTime = new Date(token.lastUpdatedAt).valueOf();
  const currentTime = new Date().valueOf();

  if(currentTime - updateTime >= 60000) {
    console.log('Token is un-assigned.');
    await UsedToken.findByIdAndDelete(job.data.tokenId); // freeing the token
    await UnUsedToken.create({ token: token.token }); // making it available for others
  }

}, { 
  connection: connectionObject
});

export { assignedTokenQueue };
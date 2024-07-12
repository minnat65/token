import { app } from './app';
import { mongoConnection } from './config/data-source';
import { DatabaseConnectionError } from './middleware/errors/database-connection-error';
import { UnUsedToken } from './models/token';

let size = Number(process.env.DEFAULT_TOKENS_NUMBER);
let tokens: Array<any> = [];

for(let idx=0; idx < size; idx++) {
  tokens.push({});
}

const start = async () => {
  try {
    mongoConnection()
      .then(async () => {
        console.log('DB Connected.');
        
        // adding some token into DB
        await UnUsedToken.insertMany(tokens);
        console.log('Data inserted.')
      })
      .catch((err) => {
        console.log(`Error connecting to DB. ${err}`);
        throw new DatabaseConnectionError();
      })
  } catch(err) {
    console.log(err);
  }
  
  app.listen(3001, () => {
    console.log("Listening on port 3001!!!!!!!!");
  });  
}

start();
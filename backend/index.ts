import app from './app';
import { connectToDatabase } from './utils/db';
import config from './utils/config';

const start = async () => {
  await connectToDatabase();
  const port = config.PORT || 3001;
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
};

start();

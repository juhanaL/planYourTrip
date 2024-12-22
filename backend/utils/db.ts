import { Sequelize } from 'sequelize';
import config from './config';

export const sequelize = new Sequelize(`${config.DATABASE_URL}`);

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('database connected');
  } catch (err) {
    console.log(`Here it comes: ${config.DATABASE_URL}`);
    console.log(`And here: ${config.WEATHER_API_KEY}`);
    console.log('connecting database failed');
    return process.exit(1);
  }

  return null;
};

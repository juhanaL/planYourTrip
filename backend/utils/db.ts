import { Sequelize } from 'sequelize';
import config from './config';

export const sequelize = new Sequelize(`${config.DATABASE_URL}`);

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('database connected');
  } catch (err) {
    console.log('connecting database failed');
    return process.exit(1);
  }

  return null;
};
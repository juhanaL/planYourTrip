import { Sequelize } from 'sequelize';
import config from './config';

export const sequelize = new Sequelize(`${config.DATABASE_URL}`, {
  logging: config.NODE_ENV === 'test' ? false : console.log,
});

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

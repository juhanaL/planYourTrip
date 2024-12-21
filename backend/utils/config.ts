import dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env;
const { WEATHER_API_KEY } = process.env;
const { X_WINDY_API_KEY } = process.env;
const { DATABASE_URL } = process.env;
const { SECRET } = process.env;

export default {
  PORT,
  WEATHER_API_KEY,
  X_WINDY_API_KEY,
  DATABASE_URL,
  SECRET,
};

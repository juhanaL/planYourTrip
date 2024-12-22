import express, { Express } from 'express';
import cors from 'cors';
import config from './utils/config';
import todosRouter from './controllers/todos';
import weatherRouter from './controllers/weather';
import loginRouter from './controllers/login';
import catchAllRouter from './controllers/catchAll';
import testingRouter from './controllers/resetTestDb';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.use('/api/todos', todosRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/login', loginRouter);
if (config.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter);
}
app.use('/*', catchAllRouter);

export default app;

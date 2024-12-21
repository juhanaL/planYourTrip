import express, { Express } from 'express';
import cors from 'cors';
import todosRouter from './controllers/todos';
import weatherRouter from './controllers/weather';
import catchAllRouter from './controllers/catchAll';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

app.use('/api/todos', todosRouter);
app.use('/api/weather', weatherRouter);
app.use('/*', catchAllRouter);

export default app;

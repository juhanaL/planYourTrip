import Router from 'express';
import Todo from '../models/todo';

const router = Router();

router.post('/reset', async (request, response) => {
  await Todo.destroy({ truncate: true, restartIdentity: true });

  response.status(204).end();
});

export default router;

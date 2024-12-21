import jwt from 'jsonwebtoken';
import { Router, Request, Response } from 'express';
import config from '../utils/config';

const router = Router();

router.post('/', async (request: Request, response: Response) => {
  const { uuid } = request.body;

  if (!uuid) {
    response.status(401).json({
      error: 'invalid uuid',
    });
    return;
  }

  const userForToken = {
    uuid,
  };

  const token = jwt.sign(userForToken, `${config.SECRET}`);

  response.status(200).send({ token, uuid });
});

export default router;

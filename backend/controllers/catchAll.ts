import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

router.get('/', (request: Request, response: Response) => {
  response.sendFile(path.join(__dirname, '../dist/index.html'), (error) => {
    if (error) {
      response.status(500).send(error);
    }
  });
});

export default router;

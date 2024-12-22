import { Router, Request, Response } from 'express';
import path from 'path';

const router = Router();

router.get('/', (request: Request, response: Response) => {
  const directoryEndPath = __dirname.includes('dist') ? '../index.html' : '../dist/index.html';

  response.sendFile(path.join(__dirname, directoryEndPath), (error) => {
    if (error) {
      response.status(500).send(error);
    }
  });
});

export default router;

import express, { Request, Response } from 'express';
import { User } from '../../models/user';

const router = express.Router();

router.get('/api/v1/common/users/by/',
  async (req: Request, res: Response) => {
  const users = await User.find({ ...req.query });

  res.send(users);
});

export { router as indexUsersByRouter };

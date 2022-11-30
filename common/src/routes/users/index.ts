import { requireAuth } from '@phibase/common-v2';
import express, { Request, Response } from 'express';
import { User } from '../../models/user';

const router = express.Router();

router.get('/api/v1/common/users/:app',
  // requireAuth,
  async (req: Request, res: Response) => {
  const users = await User.find({"props.app": req.params.app}).populate('roleRef');

  res.send(users);
});

export { router as indexUsersRouter };

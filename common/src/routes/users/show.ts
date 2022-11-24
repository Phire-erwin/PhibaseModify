import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { NotFoundError, requireAuth } from '@phibase/common-v2';

const router = express.Router();

router.get('/api/v1/common/user-by-id/:id',
  // requireAuth,
  async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id).populate('roleRef');

    if (!user) {
      throw new NotFoundError();
    }

    res.send(user);
});

export { router as showUserRouter };
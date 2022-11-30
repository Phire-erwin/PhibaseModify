import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { NotFoundError, requireAuth } from '@phibase/common-v2';
import { UserDeletedPublisher } from '../../events/publishers/user-deleted-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/v1/common/users/:id',
  // requireAuth,
  async (req: Request, res: Response) => {
    // Check existing user
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError();
    }

    // Publisher
    // new UserDeletedPublisher(natsWrapper.client).publish({
    //   id      : user.id,
    //   version : -1,
    //   email   : user.email,
    //   role    : user.role,
    //   props   : user.props,
    // })

    await user.remove();

    res.status(204).send({
      message: `Successfully delete user!`
    });
  },
);

export { router as deleteUserRouter };

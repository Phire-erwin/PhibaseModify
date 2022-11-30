import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { UserDeletedPublisher } from '../../events/publishers/user-deleted-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/v1/common/users/by/',
  async (req: Request, res: Response) => {
    // Check existing user
    const users = await User.find({ ...req.query });

    for (let data of users) {
      // Publisher
      // new UserDeletedPublisher(natsWrapper.client).publish({
      //   id      : data.id,
      //   version : -1,
      //   email   : data.email,
      //   role    : data.role,
      //   props   : data.props,
      // })

      await data.remove();
    }

    res.status(204).send({
      message: `Successfully delete users!`
    });
  },
);

export { router as deleteUsersByRouter };
import express, { Request, Response } from 'express';
import { NotFoundError } from '@phibase/common-v2';
import { User } from '../../models/user';
import { UserUpdatedPublisher } from '../../events/publishers/user-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.put(
  '/api/v1/common/auth/activate/:id',
  async (req: Request, res: Response) => {
    // Find user
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError();
    }

    user.set({
      props: {
        ...user.props,
        status: 'Active'
      }
    })
    await user.save();

    // Publisher
    // new UserUpdatedPublisher(natsWrapper.client).publish({
    //   id      : user.id,
    //   version : -1,
    //   email   : user.email,
    //   role    : user.role,
    //   props   : user.props,
    // })

    res.status(200).send({
      message: 'Activation Success!'
    });
  },
);

export { router as activateUserRouter };

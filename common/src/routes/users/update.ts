import express, { Request, Response } from 'express';
import { User } from '../../models/user';
import { NotFoundError, BadRequestError, requireAuth } from '@phibase/common-v2';
import { UserUpdatedPublisher } from '../../events/publishers/user-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.put(
  '/api/v1/common/users/:id',
  // requireAuth,
  async (req: Request, res: Response) => {
    const {
      email,
      role,
      roleRef,
      props
    } = req.body;

    // Find existing user
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      throw new NotFoundError();
    }

    // Check email
    const existingEmail = await User.findOne({ email, "props.app": props.app })

    if (existingEmail && existingEmail.id !== req.params.id) {
      throw new BadRequestError(`Email ${email} is already registered.`);
    }

    existingUser.set({
      email,
      role,
      roleRef: roleRef.id,
      props: {
        ...existingUser.props,
        ...props
      },
      updatedAt : new Date()
    })
    await existingUser.save();

    // Publisher
    // new UserUpdatedPublisher(natsWrapper.client).publish({
    //   id      : existingUser.id,
    //   version : -1,
    //   email   : existingUser.email,
    //   role    : existingUser.role,
    //   props   : existingUser.props,
    // })

    res.status(200).send(existingUser);
  },
);

export { router as updateUserRouter };

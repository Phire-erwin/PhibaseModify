import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../../models/user';
import { validateRequest, BadRequestError, requireAuth } from '@phibase/common-v2';
import { UserCreatedPublisher } from '../../events/publishers/user-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  '/api/v1/common/users',
  [
    body('email')
      .notEmpty()
      .isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters'),
    body('roleRef')
      .notEmpty().isObject().withMessage('Role must be valid')
  ],
  validateRequest,
  // requireAuth,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      roleRef,
      props
    } = req.body;

    if(roleRef.name === undefined || roleRef.id === undefined){
      throw new BadRequestError('Role must be valid. Select the Role !!!');
    }
    
    // Check existing user
    const existingUser = await User.findOne({ email, "props.app": props.app })

    if (existingUser) {
      throw new BadRequestError('Email is already registered.');
    }

    const user = User.build({
      email,
      password,
      role: roleRef.name,
      roleRef: roleRef.id,
      props: {
        ...props,
        passwordUpdatedAt: new Date(),
      }
    });
    await user.save();

    // Publisher
    // new UserCreatedPublisher(natsWrapper.client).publish({
    //   id      : user.id,
    //   version : -1,
    //   email   : user.email,
    //   role    : user.role,
    //   props   : user.props,
    // })

    res.status(201).send(user);
  },
);

export { router as newUserRouter };
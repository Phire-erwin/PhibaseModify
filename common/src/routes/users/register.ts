import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../../models/user';
import { validateRequest, BadRequestError } from '@phibase/common-v2';
import { UserCreatedPublisher } from '../../events/publishers/user-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  '/api/v1/common/auth/register',
  [
    body('email')
      .notEmpty()
      .isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 20 }).withMessage('Password must be between 6 and 20 characters')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      roleRef,
      props,
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email })

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

    // // ===== COMMENT / UNCOMMENT THIS SECTION IF NO NEED / NEED TO SEND EMAIL =====
    // // TODO: Change activation url to front end side url
    // // Create activation url
    // const activationUrl = `${req.protocol}://${req.get(
    //   'host',
    // )}/api/v1/common/auth/activate/${user._id}`; // back end side url

    // // Send email to registered user
    // await Utils.sendEmail({
    //   email: email,
    //   subject: 'Welcome to Phibase!',
    //   message: `Complete your registration by clicking this url\n\n${activationUrl}`
    // })
    // // ===========================================================

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id      : user.id,
        email   : user.email,
        role    : user.role,
        props   : user.props
      },
      process.env.JWT_KEY!,
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    // Publisher
    // new UserCreatedPublisher(natsWrapper.client).publish({
    //   id      : user.id,
    //   version : -1,
    //   email   : user.email,
    //   role    : user.role,
    //   props   : user.props,
    // })

    res.status(201)
      .send({
        token: userJwt,
        user
      });
  },
);

export { router as registerRouter };
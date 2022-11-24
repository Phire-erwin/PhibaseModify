import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../../models/user';
import { Utils } from '../../services/utils';
import { validateRequest, BadRequestError } from '@phibase/common-v2';

const router = express.Router();

router.post(
  '/api/v1/common/auth/resend-email',
  [
    body('email')
      .isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError('Email is not registered.');
    }

    // // TODO: Change activation url to front end side url
    // // Create activation url
    // const activationUrl = `${req.protocol}://${req.get(
    //   'host',
    // )}/api/v1/common/auth/activate/${existingUser._id}`; // back end side url

    // // Send email to registered user
    // await Utils.sendEmail({
    //   email: email,
    //   subject: 'Welcome to Phibase!',
    //   message: `Complete your registration by clicking this url\n\n${activationUrl}`
    // })

    res.status(201).send({
      message: 'Email sent!'
    });
  },
);

export { router as resendEmailRouter };
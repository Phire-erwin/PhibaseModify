import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import crypto from 'crypto';
import { User } from '../../models/user';
import { validateRequest, NotFoundError } from '@phibase/common-v2';

const router = express.Router();

router.post(
  '/api/v1/common/auth/forgot-password',
  [
    body('email')
      .isEmail().withMessage('Email must be valid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, app } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email, "props.app": app });

    if (!existingUser) {
      throw new NotFoundError();
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    existingUser.set({
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: resetPasswordExpire
    })
    await existingUser.save();

    // // TODO: Change reset url to front end side url
    // // Create reset url
    // const resetUrl = `${req.protocol}://${req.get(
    //   'host',
    // )}/api/v1/common/auth/reset-password/${resetToken}`; // back end side url

    // // Send email to user
    // await Utils.sendEmail({
    //   email: email,
    //   subject: 'Password Reset Token',
    //   message: `You are receiving this email because you (or someone else) have requested the reset of a password. Please follow this link to change your password:\n\n${resetUrl}`
    // })

    res.status(201).send({
      token: resetToken
    });
  },
);

export { router as forgotPasswordRouter };
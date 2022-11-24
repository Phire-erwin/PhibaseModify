import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@phibase/common-v2';
import { Role } from '../../models/role';

const router = express.Router();

router.post(
  '/api/v1/common/roles',
  [
    body('name').not().isEmpty().withMessage('Name required'),
    body('level').not().isEmpty().withMessage('Level required'),
    body('app').not().isEmpty().withMessage('App required')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      level,
      permission,
      app,
      props
    } = req.body;

    const trimmedName = name.trim();
    const trimmedLevel = level.trim();

    const existingRole = await Role.findOne({
      name    : trimmedName,
      level   : trimmedLevel,
      app
    });

    if (existingRole) {
      throw new BadRequestError(`Role with name ${trimmedName} and level ${trimmedLevel} is already registered.`);
    }

    const role = Role.build({
      name,
      level,
      permission,
      app,
      props
    });
    await role.save();

    res.status(201).send(role);
  }
);

export { router as newRoleRouter };
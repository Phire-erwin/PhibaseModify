import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, NotFoundError, BadRequestError } from '@phibase/common-v2';
import { Role } from '../../models/role';

const router = express.Router();

router.put(
  '/api/v1/common/roles/:id',
  [
    body('name').not().isEmpty().withMessage('Name required'),
    body('level').not().isEmpty().withMessage('Level required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const role = await Role.findById(req.params.id);

    if (!role) {
      throw new NotFoundError();
    }

    const {
      name,
      level,
      permission,
      props,
    } = req.body;

    const trimmedName = name.trim();
    const trimmedLevel = level.trim();

    const existingRole = await Role.findOne({
      name    : trimmedName,
      level   : trimmedLevel,
      app     : role.app
    })

    if (existingRole && existingRole.id !== role.id) {
      throw new BadRequestError(`Role with name ${trimmedName} and level ${trimmedLevel} is already registered.`);
    }

    role.set({
      name,
      level,
      permission,
      props,
      updatedAt : new Date()
    });
    await role.save();

    res.send(role);
  },
);

export { router as updateRoleRouter };
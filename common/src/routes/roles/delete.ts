import express, { Request, Response } from 'express';
import { NotFoundError, BadRequestError } from '@phibase/common-v2';
import { Role } from '../../models/role';
import { User } from '../../models/user';

const router = express.Router();

router.delete('/api/v1/common/roles/:id', async (req: Request, res: Response) => {
    const role = await Role.findById(req.params.id);

    if (!role) {
      throw new NotFoundError();
    }

    if (role.name === 'Super Admin' && role.level === 'Super Admin') {
      throw new BadRequestError('Super Admin with level Super Admin cannot be deleted.')
    }

    // Check if there's any user using this role
    const user = await User.find({ roleRef: req.params.id });

    if (user.length !== 0) {
      throw new BadRequestError(`Cannot delete role. There's user assigned with this role.`);
    }

    await role.remove();

    res.status(204).send(role);
  },
);

export { router as deleteRoleRouter };
import express, { Request, Response } from 'express';
import { User } from '../../models/user';

const router = express.Router();

router.get('/api/v1/common/users-count-role/:app',
  async (req: Request, res: Response) => {
  const users = await User.aggregate([{
    $match: {
      $and: [
        {
          "props.app": req.params.app
        },
        {
          role: { $ne: 'Super Admin' }
        }
      ]
    }
  }, {
    $group: {
      _id: "$role",
      total: { $sum: 1 }
    }
  }]).sort({_id: 1});

  const role = users.map((el: any) => {
    return el._id
  })

  const total = users.map((el: any) => {
    return el.total
  })

  res.send({
    role: role,
    total: total
  });
});

export { router as countRoleUsersRouter };

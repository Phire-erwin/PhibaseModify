import express, { Request, Response } from 'express';
import { User } from '../../models/user';

const router = express.Router();

router.get('/api/v1/common/users-by-date/:app',
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
      _id: {
        day: { $dayOfMonth: "$createdAt" },
        month: { $month: "$createdAt" },
        year: { $year: "$createdAt" }
      },
      count: { $sum:1 },
      date: { $first: "$createdAt" }
    }
  }, {
    $project: {
      date: {
        $dateToString: { format: "%Y-%m-%d", date: "$date" }
      },
      count: 1,
      _id: 0
    }
  }]).sort({date: 1});

  const numberOfUsers = users.map((el: any) => {
    return el.count;
  })

  const date = users.map((el: any) => {
    return el.date;
  })

  res.send({
    user: numberOfUsers.splice(-7),
    date: date.splice(-7)
  });
});

export { router as countUsersByDateRouter };

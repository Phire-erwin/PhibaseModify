import express, { Request, Response } from 'express';
import { Item } from '../../models/item';

const router = express.Router();

router.get('/api/v1/common/items-by-domain',
  async (req: Request, res: Response) => {
  const items = await Item.aggregate([{
    $unwind:"$domain"
  }, {
    $group: {
      _id: "$domain",
      total: { $sum: 1 }
    }
  }]).sort({_id: 1});

  const domain = items.map((el: any) => {
    return el._id ? el._id[0].toUpperCase() + el._id.slice(1) : el._id;
  })

  const total = items.map((el: any) => {
    return el.total
  })

  res.send({
    domain: domain,
    total: total
  });
});

export { router as getItemByDomainRouter };

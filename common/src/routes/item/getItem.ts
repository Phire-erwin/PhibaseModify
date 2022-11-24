import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Item } from '../../models/item';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';


const router = express.Router();

router.get(
  '/api/v1/common/items/:id',
  [
    
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    var item;
    try {
      item = await Item.findById(req.params.id);
    } catch (err) {
      throw new BadRequestError("The Category with "+req.params.id+" does not found")
    }
    
    res.status(200).send({data:item});
  },
);

export { router as getItemRouter };

import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Item } from '../../models/item';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';
import { mongoQuery } from '@phibase/common-v2';

const router = express.Router();

router.get(
  '/api/v1/common/items',
  mongoQuery,
  [
    
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    var items;
    
    try{
      items = await Item.find(req.mongoQuery)  
    }catch(err){
      throw new BadRequestError("ERROR: "+err)
    }
    
    res.status(200).send({data:items});
  },
);

export { router as getItemsRouter };

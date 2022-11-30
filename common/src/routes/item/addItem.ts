import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Item } from '../../models/item';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';
import { ItemCreatedPublisher } from '../../events/publishers/item-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  '/api/v1/common/items',
  [
    body('name')
      .notEmpty().withMessage('Name required'),
    body('props.id')
      .trim()
      .notEmpty().withMessage('ID required'),
    body('app')
      .notEmpty().withMessage('App required'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    /**
     * req body expected
     * {
     *  name:string,
     *  domain:string[],
     *  app:string,
     *  props:object
     * }
     */

    // Check existing item
    const existingItem = await Item.findOne({ "props.id": req.body.props.id, app: req.body.app });

    if (existingItem) {
      throw new BadRequestError(`Item with ID ${req.body.props.id} is already registered`);
    }
    
    var item;
    try{
      item= new Item(req.body);
      await item.save();
      
    }catch(err){
      console.log(err)
      throw new BadRequestError("error to add item "+err)
    }

    // await new ItemCreatedPublisher(natsWrapper.client).publish({
    //   id:item.id,
    //   version:0,
    //   name:item.name,
    //   domain:item.domain[0],
    //   app:item.app,
    //   props:item.props
    // })


    
    res.status(200).send({data:item});
  },
);

export { router as addItemRouter };

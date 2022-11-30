import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Item } from '../../models/item';
import { RequestValidationError, BadRequestError, propUpdate } from '@phibase/common-v2';
//import { ItemUpdatedPublisher } from '../../events/publishers/item-updated-publisher';
import { ItemUpdatedPublisher } from '../../events/publishers/item-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.put(
  '/api/v1/common/items/:id',
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
    
    var item;
    try {
      item = await Item.findById(req.params.id);
    } catch (err) {
      throw new BadRequestError("The Item with "+req.params.id+" does not found")
    }

    // Check existing item id
    const existingItem = await Item.findOne({ "props.id": req.body.props.id, app: req.body.app })

    if (existingItem && existingItem.id !== req.params.id) {
      throw new BadRequestError(`Item with ID ${req.body.props.id} is already registered`);
    }

    if(item===null){
      throw new BadRequestError("item is null")
    }
    // Update item props, if available
    if(req.body.props){
      item.props=(item.props)?item.props:{created:new Date()};
      let newProps = propUpdate(item.props,req.body.props);
      req.body.props=newProps
    }
    
    try {
      item = await Item.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new:true,
          runValidators:true
        }
      );

      if(item===null){
        throw new BadRequestError("item is null")
      }
      await item.save();

      //publish item through nats publisher
      var idItem=(item.id)?item.id.toString():item._id.toString();
      
      // Update time
      item.updatedAt = new Date();
      await item.save();
    } catch (err) {
      throw new BadRequestError("failed item update")
    }

    // await new ItemUpdatedPublisher(natsWrapper.client).publish({
    //   id:item.id,
    //   version:1,
    //   name:item.name,
    //   domain:item.domain[0],
    //   app:item.app,
    //   props:item.props
    // })

    res.status(200).send({data:item});
  },
);

export { router as updateItemRouter };

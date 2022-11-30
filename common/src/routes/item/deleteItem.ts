import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Item } from '../../models/item';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';
import { ItemDeletedPublisher } from '../../events/publishers/item-deleted-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.delete(
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
      throw new BadRequestError("Error getting item "+req.params.id)
    }
    if(!item){
      console.error("Item is not found")
      throw new BadRequestError("Item is not found")
    }

    /**BOM Handler */
    try{
    var bomComponent = await Item.find({'props.components.id':req.params.id})
    }catch(err){
      console.log(err)
      throw new BadRequestError("Error getting bom data")
    }
    if(bomComponent.length>0){
      console.error("Item is used on BOM, cannot be deleted")
      throw new BadRequestError("Item is used on BOM, cannot be deleted")
    }

    // Delete transaction
    try {
      await item.remove();

    } catch (err) {
      throw new BadRequestError("ERROR: "+err)
    
    }

    // await new ItemDeletedPublisher(natsWrapper.client).publish({
    //   id:req.params.id,
    //   version:-1,
    //   name:"",
    //   domain:"",
    //   app:"",
    //   props:{}
    // })
  res.status(200).send({data:{}});
  },
);

export { router as deleteItemRouter };

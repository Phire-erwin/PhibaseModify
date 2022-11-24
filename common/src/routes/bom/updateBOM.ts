import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Item } from '../../models/item';
import { RequestValidationError, BadRequestError } from '@phibase/common-v2';


import { ItemCreatedPublisher } from '../../events/publishers/item-created-publisher';
import { ItemUpdatedPublisher } from '../../events/publishers/item-updated-publisher';


import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.put(
  '/api/v1/common/boms/:id',
  [
    
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    var bomData= req.body;

    /**
     * req body expected
     * {
     *  name:string,
     *  domain:string[],
     *  app:string,
     *  props:{
     *    components:[{
     *      //if component uses id, components is already created
     *      id:ObjectID||string
     *      quantity:number
     *    },{
     *      //if component uses name, create new component
     *      name:string
     *      quantity:number
     *    }]
     *  }
     * }
     */

    if(!bomData.props.components){
      throw new BadRequestError('BOM Data should need to have props.components')
    }
    if(bomData.props.components.length<=0){
      throw new BadRequestError('BOM Data should have props.components atleast one data')
    }

    //Process Components
    var curComponent;
    var componentData;
    for(var i =0;i<bomData.props.components.length;i++){
      curComponent=bomData.props.components[i];
      
      if(!curComponent.id&&!curComponent.name){
        throw new BadRequestError('Component should have id or name')
      }
      //if no id is provided, create new item
      if(!curComponent.id){
        componentData = await Item.create(
          {
            name:curComponent.name,
            domain:bomData.domain,
            app:bomData.app,
            props:{}
          }
        )
        bomData.props.components[i].id=componentData.id;
        
        await new ItemCreatedPublisher(natsWrapper.client).publish({
          id:componentData.id,
          version:0,
          name:componentData.name,
          domain:componentData.domain[0],
          app:componentData.app,
          props:componentData.props
        })
        
        continue;
      }
      //check for component
      componentData = await Item.findById(curComponent.id);

      if(!componentData){
        throw new BadRequestError('Component inserted is not found')
      }
      bomData.props.components[i].name=componentData.name;
    }
    
    var item;
    try{
      item= await Item.findByIdAndUpdate(req.params.id,
        bomData,
        {
          new:true,
          runValidators:true
        }
      );
      
      if(item===null){
        throw new BadRequestError("item is null")
      }
      await new ItemUpdatedPublisher(natsWrapper.client).publish({
        id:item.id,
        version:1,
        name:item.name,
        domain:item.domain[0],
        app:item.app,
        props:item.props
      })
      
    }catch(err){
      console.log(err)
      throw new BadRequestError("error to add item "+err)
    }
    
    res.status(200).send({data:item});
  },
);

export { router as addBOMRouter };

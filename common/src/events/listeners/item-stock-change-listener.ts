import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ItemStockChangeEvent,propUpdate } from '@phibase/common-v2';
import { Item } from '../../models/item';
import { ItemUpdatedPublisher } from '../publishers/item-updated-publisher'
import { queueGroupName } from './queue-group-name';
import { natsWrapper } from '../../nats-wrapper';

export class ItemStockChangeListener extends Listener<ItemStockChangeEvent> {
  subject: Subjects.ItemStockChange = Subjects.ItemStockChange;
  queueGroupName = queueGroupName;

  async onMessage(data: ItemStockChangeEvent['data'], msg: Message) {
    const { itemStockChangeList,source,message,props } = data;
    /*

    */
    console.log('source('+source+') message'+message)
    var item;
    var itemStock:number;
    var newStock=0;
    for(var i=0;i<itemStockChangeList.length;i++){
      item = await Item.findById(itemStockChangeList[i].itemID);
      if(!item){
        continue;
      }
      //if item stock type is not number, parseFloat
      itemStock = (!item.props)?0:( typeof item.props.stock   =='number')?item.props.stock: parseFloat(item.props.stock)

      //check for NaN
      itemStock = (itemStock==NaN||!itemStock)?0:itemStock;
      
      newStock=itemStock+itemStockChangeList[i].quantity;
      item.props=(item.props)?item.props:{created:new Date()};
      var newProps = propUpdate(item.props,{stock:newStock});
      item =await Item.findByIdAndUpdate(itemStockChangeList[i].itemID,{
        props:newProps
      },{new:true})
      if(!item){
        continue;
      }

      await new ItemUpdatedPublisher(natsWrapper.client).publish({
        id:item.id,
        version:2,
        name:item.name,
        domain:item.domain[0],
        app:item.app,
        props:item.props
      })

    }

    msg.ack();
  }
}

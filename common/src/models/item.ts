import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new Item
interface ItemAttrs {
  name  ?: string;
  domain?: string[];
  app   ?: string;
  props ?: any;
}

// An interface that describes the properties
// that a Item Model has
interface ItemModel extends mongoose.Model<ItemDoc> {
  build(attrs: ItemAttrs): ItemDoc;
}

// An interface that describes the properties
// that a Item Document has
interface ItemDoc extends mongoose.Document {
  name      : string;
  domain    : string[];
  app       : string;
  props     : any;
  updatedAt : Date;
}

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    domain: {
      type: Array,
      required: [true, 'Domain is required.'],
    },
    app: {
      type: String,
      required: [true, 'App is required.'],
    },
    props: {
      type: Object
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  },
);


ItemSchema.statics.build = (attrs: ItemAttrs) => {
  return new Item(attrs);
};

const Item = mongoose.model<ItemDoc, ItemModel>('Item', ItemSchema);

export { Item };

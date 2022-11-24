import {Document, model, Model, Schema,Types} from 'mongoose';

const LogSchema: Schema = new Schema(
  {
    domain: {
      type: String,
      required: [true, 'Domain is required.'],
    },
    app: {
      type: String,
      required: [true, 'App is required.'],
    },
    props: {
      type: Object,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },{
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        ret.timestamp= new Date(ret.timestamp).toLocaleString('id-ID')
      },
    },
  }
);

interface ILog extends Document {
  domain    : string;
  app       : string;
  props?    : any;
}
const Log : Model<ILog> = model<ILog>('Log', LogSchema);


export{Log};
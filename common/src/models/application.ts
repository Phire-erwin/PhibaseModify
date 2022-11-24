import mongoose from 'mongoose';
import { Key } from '../services/key'

// An interface that describes the properties
// that are required to create a new Application Info
interface ApplicationAttrs {
  name  : string;
  props?: any;
}

// An interface that describes the properties
// that a Application Info Model has
interface ApplicationModel extends mongoose.Model<ApplicationDoc> {
  build(attrs: ApplicationAttrs): ApplicationDoc;
}

// An interface that describes the properties
// that a Company Info Document has
interface ApplicationDoc extends mongoose.Document {
  name      : string;
  appID     : string;
  props     : any;
  updatedAt : Date;
}

const ApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    appID:{
      type: String,
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
        //remove privateKey
        delete ret.props.privateKey;
        if(ret.props.publicKey){
          delete ret.props.publicKey;
        }
        
      },
    },
  },
);

ApplicationSchema.pre('save', async function (done) {
  if(this.isNew){
    var appName:string =this.get('name');
    //lower case all string
    var appID:string=appName.toLowerCase();
    //replace space with dash (-)
    appID= appID.replace(/ /g,"-");
    //remove all symboles
    appID= appID.replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    //generating key, DO NOT CHANGE
    var key = Key.generatePrivate();
    this.set('props.privateKey',key);

    this.set('appID', appID);
  }
});


ApplicationSchema.statics.build = (attrs: ApplicationAttrs) => {
  return new Application(attrs);
};

const Application = mongoose.model<ApplicationDoc, ApplicationModel>('Application', ApplicationSchema);

export { Application };

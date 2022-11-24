import mongoose from 'mongoose';
import { Password } from '../services/password';
import { encrypt, decrypt } from '../services/cryptoController';

// An interface that describes the properties
// that are required to create a new EmailSetting
interface EmailSettingAttrs {
  email             ?: string;
  previousPassword  ?: string;
  add               ?: string;
  password          ?: string;
  port              ?: number;
  outgoingName      ?: string;
  displayName       ?: string;
  role              ?: string;
  roleRef           ?: any;
  props             ?: any;
}

// An interface that describes the properties
// that a EmailSetting Model has
interface EmailSettingModel extends mongoose.Model<EmailSettingDoc> {
  build(attrs: EmailSettingAttrs): EmailSettingDoc;
}

// An interface that describes the properties
// that a EmailSetting Document has
interface EmailSettingDoc extends mongoose.Document {
  email               : string;
  previousPassword    : string;
  add                 : string;
  password            : string;
  port                : number;
  outgoingName        : string;
  displayName         : string;
  role                : string;
  roleRef             : any;
  props               : any;
  updatedAt           : Date;
  resetPasswordToken  : string;
  resetPasswordExpire : number;
}

const EmailSettingSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    previousPassword: {
      type: String,
    },
    password: {
      type: String,
    },
    add: {
        type: String,
    },
    port: {
        type: Number,
    },
    outgoingName: {
        type: String,
    },
    displayName: {
        type: String,
    },
    role: {
      type: String,
    },
    roleRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
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
    },
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

EmailSettingSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = encrypt(this.get('password'));
    this.set('password', hashed.content);
    this.set('add', hashed.iv);
  }
  done();
});

EmailSettingSchema.statics.build = (attrs: EmailSettingAttrs) => {
  return new EmailSetting(attrs);
};

const EmailSetting = mongoose.model<EmailSettingDoc, EmailSettingModel>('EmailSetting', EmailSettingSchema);

export { EmailSetting };

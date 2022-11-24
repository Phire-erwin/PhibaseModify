import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new User
interface AdminAttrs {
  email     ?: string;
  password  ?: string;
}

// An interface that describes the properties
// that a User Model has
interface AdminModel extends mongoose.Model<AdminDoc> {
  build(attrs: AdminAttrs): AdminDoc;
}

// An interface that describes the properties
// that a User Document has
interface AdminDoc extends mongoose.Document {
  email               : string;
  password            : string;
  resetPasswordToken  : string;
}

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
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

adminSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

adminSchema.statics.build = (attrs: AdminAttrs) => {
  return new Admin(attrs);
};

const Admin = mongoose.model<AdminDoc, AdminModel>('Admin', adminSchema);

export { Admin };
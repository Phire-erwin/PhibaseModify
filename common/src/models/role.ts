/**
 * @file Role Schema
 * @copyright Phire Studio, 2022
 * @version 1.0.0
 * @module common/src/models/role.ts
 */

import mongoose from 'mongoose';

// An interface that describes the properties
// that are required to create a new Role
interface RoleAttrs {
  name       ?: string;
  level      ?: string;
  permission ?: any;
  app        ?: string;
  props      ?: any;
}

// An interface that describes the properties
// that a Role Model has
interface RoleModel extends mongoose.Model<RoleDoc> {
  build(attrs: RoleAttrs): RoleDoc;
}

// An interface that describes the properties
// that a Role Document has
interface RoleDoc extends mongoose.Document {
  name       : string;
  level      : string;
  permission : any;
  app        : string;
  props      : any;
  updatedAt  : any;
}

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    level: {
      type: String,
      trim: true
    },
    permission: {
      type: Object
    },
    app: {
      type: String
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
      },
    },
  },
);

roleSchema.statics.build = (attrs: RoleAttrs) => {
  return new Role(attrs);
};

const Role = mongoose.model<RoleDoc, RoleModel>('Role', roleSchema);

export { Role };
import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are required to create a new Application Info
interface AdminAttrs {
    email     ?: string;
    password  ?: string;
    role      ?: string;
    roleRef   ?: any;

}

// An interface that describes the properties
// that a Application Info Model has
interface AdminModel extends mongoose.Model<AdminDoc> {
    build(attrs: AdminAttrs): AdminDoc;
}

// An interface that describes the properties
// that a Company Info Document has
interface AdminDoc extends mongoose.Document {
    email     : string;
    password  : string;
    appID     : string;
    role      : string;
    updatedAt : Date;
    roleRef   : any;
}

const AdminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        appID: {
            type: String,
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

AdminSchema.pre('save', async function (done) {
    // if(this.isNew){
    //     var appName:string =this.get('role');
    //     //lower case all string
    //     var appID:string=appName.toLowerCase();
    //     //replace space with dash (-)
    //     appID= appID.replace(/ /g,"-");
    //     //remove all symboles
    //     appID= appID.replace(/[`~!@#$%^&*()_|+\=?;:'",.<>\{\}\[\]\\\/]/gi, '');

    //     //generating key, DO NOT CHANGE

    //     this.set('appID', appID);
    // }

    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

AdminSchema.statics.build = (attrs: AdminAttrs) => {
    return new Admin(attrs);
};

const Admin = mongoose.model<AdminDoc, AdminModel>('Admin', AdminSchema);

export { Admin };

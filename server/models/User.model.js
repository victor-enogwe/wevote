import mongoose from 'mongoose'
import { isEmail, isURL, isMobilePhone } from 'validator'
import { schemaComposer } from 'graphql-compose'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import {
  modifyResolver,
  setGlobalResolvers,
  grantAccessAdmin as admin,
  grantAccessAdminOrOwner as adminOwner
} from '../middlewares'

const Schema = mongoose.Schema
const addressSchema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String }
}, { autoIndex: false })
const userSchema = new Schema({
  socialId: {
    type: String,
    required: true,
    unique: true,
    match: /\d+/
  },
  displayName: {
    type: String,
    required: [true, 'displayName is required'],
    match: /^([A-Za-z]+((\s[A-Za-z]+)+)?)$/
  },
  emails: [{ value: {
    type: String,
    required: true,
    unique: true,
    validate: [{
      validator: value => isEmail(value),
      message: 'email is invalid.'
    }]
  } }],
  photos: [{ value: { type: String, validate: { validator: isURL } } }],
  address: addressSchema,
  phone: {
    type: String,
    validate: [{
      validator: value => isMobilePhone(value, this.address.country),
      message: 'phone is invalid.'
    }]
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  },
  vriTaken: {
    type: Boolean,
    default: false
  }
}, { autoIndex: false })

const model = mongoose.model('User', userSchema)
const modelTC = composeWithMongoose(model, {
  resolvers: {
    updateById: {
      record: {
        removeFields: ['socialId', 'roleId']
      }
    }
  }
})

setGlobalResolvers(model, modelTC, 'User')
schemaComposer.rootQuery().addFields({
  UserFindOne: modifyResolver(modelTC.getResolver('findOne'), admin),
  UserFindById: modifyResolver(modelTC.getResolver('findById'), adminOwner),
  UserFindByIds: modifyResolver(modelTC.getResolver('findByIds'), admin),
  UserFindMany: modifyResolver(modelTC.getResolver('findMany'), admin),
  UserCount: modifyResolver(modelTC.getResolver('count'), admin),
  UserConnection: modifyResolver(
    modelTC.getResolver('connection'), admin
  ),
  UserPagination: modifyResolver(modelTC.getResolver('pagination'), admin)
})

schemaComposer.rootMutation().addFields({
  UserUpdateById: modifyResolver(modelTC.getResolver('updateById'), adminOwner),
  UserRemoveById: modifyResolver(modelTC.getResolver('removeById'), adminOwner)
})

const schema = schemaComposer.buildSchema()

module.exports.modelTC = modelTC
module.exports.model = model
export default {
  model,
  modelTC,
  schema,
  addRelations (modelTCS) {
    modelTC.addRelation('responseMap', {
      description: 'the user response map',
      resolver: modelTCS.Response.getResolver('findMany'),
      args: {
        filter: source => ({ creatorId: source._id }),
        limit: (source, args) => args.limit
      },
      projection: { _id: true }
    })

    modelTC.addRelation('roleDetails', {
      description: 'the user role',
      resolver: modelTCS.Role.getResolver('findById'),
      prepareArgs: { _id: source => source.roleId },
      projection: { roleId: true }
    })
  }
}

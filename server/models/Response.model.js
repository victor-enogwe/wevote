import mongoose from 'mongoose'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import { schemaComposer } from 'graphql-compose'
import createMany from '../models/create-many-resolver'
import {
  modifyResolver,
  setGlobalResolvers,
  grantAccessAdminOrOwner as userAdmin,
  grantAccessAdmin as admin,
  grantAccessOwner as owner
} from '../middlewares'

const Schema = mongoose.Schema
const userSubResponseSchema = new Schema({
  question: {
    type: String,
    required: [true, 'sub-question question required']
  },
  answer: {
    type: String,
    required: [true, 'sub-question answer required']
  }
}, { _id: false, autoIndex: false })
const userResponseSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'creator id required']
  },
  questionId: {
    type: String,
    unique: true,
    required: [true, 'question id required']
  },
  answer: {
    type: String
  }
}, { autoIndex: false })

userResponseSchema.add({
  subResponses: {
    type: [userSubResponseSchema]
  }
})

const model = mongoose.model('Response', userResponseSchema)
const modelTC = composeWithMongoose(model)
modelTC.setResolver('createMany', createMany(model, modelTC))
setGlobalResolvers(model, modelTC, 'Response')

schemaComposer.rootQuery().addFields({
  ResponseFindOne: modifyResolver(modelTC.getResolver('findOne'), userAdmin),
  ResponseFindById: modifyResolver(modelTC.getResolver('findById'), userAdmin),
  ResponseFindByIds: modifyResolver(modelTC.getResolver('findByIds'), admin),
  ResponseFindMany: modifyResolver(modelTC.getResolver('findMany'), admin),
  ResponseCount: modifyResolver(modelTC.getResolver('count'), admin),
  ResponseConnection: modifyResolver(modelTC.getResolver('connection'), admin),
  ResponsePagination: modifyResolver(modelTC.getResolver('pagination'), admin)
})

schemaComposer.rootMutation().addFields({
  ResponseCreateOne: modifyResolver(modelTC.getResolver('createOne'), owner),
  ResponseCreateMany: modifyResolver(modelTC.getResolver('createMany'), owner),
  ResponseUpdateOne: modifyResolver(modelTC.getResolver('updateOne'), owner)
})

const schema = schemaComposer.buildSchema()

module.exports.modelTC = modelTC
module.exports.model = model
export default {
  model,
  modelTC,
  schema,
  addRelations (modelTCS) {
    modelTC.addRelation('creatorDetails', {
      description: 'the creator of this response',
      resolver: modelTCS.User.getResolver('findById'),
      prepareArgs: { _id: source => source.creatorId },
      projection: { creatorId: true }
    })
  }
}

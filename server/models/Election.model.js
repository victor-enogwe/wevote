import mongoose from 'mongoose'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import { schemaComposer } from 'graphql-compose'
import { isURL } from 'validator'
import {
  modifyResolver,
  setGlobalResolvers,
  grantAccessAdmin as admin
} from '../middlewares'

const Schema = mongoose.Schema
const candidatesSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    match: /^([A-Za-z]+((\s[A-Za-z]+)+)?)$/
  },
  image: {
    type: String,
    validate: { validator: isURL },
    required: [true, 'image url is required']
  },
  wikiLink: {
    type: String,
    validate: { validator: isURL }
  },
  about: {
    type: String,
    validate: [{
      validator: value => /\w{0,1000}/.test(value),
      message: 'about must be string between 0 and 1000 characters'
    }]
  }
}, { _id: false })
const electionSchema = new Schema({
  date: {
    type: Date,
    required: true
  },
  title: { type: String, index: true, match: /\w{0,255}/, required: true },
  electionType: {
    type: String,
    enum: ['text', 'option', 'select', 'date', 'none'],
    required: true
  },
  candidates: {
    type: [candidatesSchema],
    validate: [{
      validator (value) {
        const candidates = value.map(candidate => candidate.title)
        const candidateSet = new Set(candidates)

        return candidateSet.size === candidates.length
      },
      message: 'candidates for this question must be unique'
    }],
    index: false
  },
  about: {
    type: String,
    validate: [{
      validator: value => /\w{0,255}/.test(value),
      message: 'recommendation must be string between 0 and 1000 characters'
    }]
  }
}, { autoIndex: false })

const model = mongoose.model('Election', electionSchema)
const modelTC = composeWithMongoose(model)

setGlobalResolvers(model, modelTC, 'Election')

schemaComposer.rootQuery().addFields({
  ElectionFindOne: modelTC.getResolver('findOne'),
  ElectionFindById: modelTC.getResolver('findById'),
  ElectionFindByIds: modelTC.getResolver('findByIds'),
  ElectionFindMany: modelTC.getResolver('findMany'),
  ElectionCount: modelTC.getResolver('count'),
  ElectionConnection: modelTC.getResolver('connection'),
  ElectionPagination: modelTC.getResolver('pagination')
})

schemaComposer.rootMutation().addFields({
  ElectionCreateOne: modifyResolver(modelTC.getResolver('createOne'), admin),
  ElectionUpdateById: modifyResolver(modelTC.getResolver('updateById'), admin),
  ElectionRemoveById: modifyResolver(modelTC.getResolver('removeById'), admin)
})

const schema = schemaComposer.buildSchema()

module.exports.modelTC = modelTC
module.exports.model = model
export default { model, modelTC, schema }

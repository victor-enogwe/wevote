import mongoose from 'mongoose'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import { schemaComposer } from 'graphql-compose'
import {
  modifyResolver,
  setGlobalResolvers,
  grantAccessAdminOrOwner as userAdmin,
  grantAccessAdmin as admin,
  grantAccessOwner as owner
} from '../middlewares'

function extractOptions (questions) {
  return questions.reduce((a, b) => a.options.concat(...b.options))
    .map(option => option.title)
}

const Schema = mongoose.Schema
const userSubResponseSchema = new Schema({
  question: {
    type: String,
    required: [true, 'sub-question question required'],
    validate: [{
      validator (value) {
        const doc = this.parent().questionDetails
        if (!doc || !doc.subQuestions) {
          return false
        }
        const questions = doc.subQuestions
        return questions.map(question => question.question)
          .includes(value)
      },
      message: 'sub-question does not exist'
    }]
  },
  answer: {
    type: String,
    validate: [{
      async validator (value) {
        const doc = this.parent().questionDetails
        if (!doc || !doc.subQuestions || !doc.subQuestions.options) {
          return false
        }
        return extractOptions(doc.subQuestions)
          .includes(value)
      },
      message: 'answer is not part of this questions options'
    }],
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
    type: Number,
    unique: true,
    required: [true, 'question id required'],
    validate: [{
      validator (value) {
        return this.questionDetails
          ? this.questionDetails.questionId === value : false
      },
      message: 'question does not exist'
    }]
  },
  answer: {
    type: String,
    validate: [{
      validator (value) {
        if (!this.options) {
          return false
        }
        return this.questionDetails
          ? this.questionDetails.options.map(option => option.title)
            .includes(value) : false
      },
      message: 'answer not part of this questions options'
    }]
  }
})

userResponseSchema.add({
  subResponses: {
    type: [userSubResponseSchema],
    validate: [{
      validator: value => value.length === this.questionDetails.options.length,
      message: `all and only sub-questions must and can be answered`
    }]
  }
})

const questionDetails = userResponseSchema.virtual('questionDetails')

userResponseSchema.pre('validate', async function () {
  const question = await this.model('Question').findById(this.questionId)
  questionDetails.get(() => question)
})

const model = mongoose.model('Response', userResponseSchema)
const modelTC = composeWithMongoose(model)

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

    modelTC.addFields({
      question: {
        type: 'String',
        description: 'the question title',
        resolve: source => source._doc.question
      }
    })
  }
}

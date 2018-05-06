import mongoose from 'mongoose'
import { GraphQLError } from 'graphql'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import { schemaComposer } from 'graphql-compose'
import {
  modifyResolver,
  setGlobalResolvers,
  grantAccessAdminOrUser as userAdmin,
  grantAccessAdmin as admin,
  grantAccessOwner as owner
} from '../middlewares'
import { modelTC as questionModelTC } from './Question.model'

function extractOptions (questions) {
  return questions.reduce((a, b) => a.options.concat(...b.options))
    .map(option => option.title)
}

const Schema = mongoose.Schema
const userSubResponseSchema = new Schema({
  question: {
    type: String,
    required: [
      true, 'sub-question question required'
    ],
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
    required: [
      true, 'sub-question answer required'
    ],
    validate: [{
      async validator (value) {
        const doc = this.parent().questionDetails
        if (!doc || !doc.subQuestions) {
          return false
        }
        return extractOptions(doc.subQuestions)
          .includes(value)
      },
      message: 'answer is not part of this questions options'
    }]
  }
}, { _id: false })
const userResponseSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [
      true, 'creator id required'
    ]
  },
  questionId: {
    type: Schema.Types.ObjectId,
    ref: 'Question',
    unique: true,
    required: [
      true, 'question id required'
    ],
    validate: [{
      validator (value) {
        return this.questionDetails
          ? String(this.questionDetails._id) === String(value) : false
      },
      message: 'question does not exist'
    }]
  },
  answer: {
    type: String,
    required: [
      true, 'answer required'
    ],
    validate: [{
      validator (value) {
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
      validator: value => value.length <= 4,
      message: 'user sub-response cannot be more than 4'
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
  ResponseFindOne: modifyResolver(modelTC.getResolver('findOne'), admin),
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
        resolve: (source, args, context) => {
          if (!source.questionId) {
            return new GraphQLError(
              'this question field requires the questionId field in query'
            )
          }

          return context.loaders.questionLoader
            .load(source.questionId)
            .then(question => question.question)
        }
      },
      score: {
        type: 'String',
        description: 'the question overall score',
        resolve: (source, args, context) => {
          if (!source.questionId) {
            return new GraphQLError(
              'the score field requires the questionId field in query'
            )
          }

          return context.loaders.questionLoader
            .load(source.questionId)
            .then(question => question.score)
        }
      },
      questionDetails: {
        type: questionModelTC.getType(),
        description: 'the question details',
        resolve: (source, args, context) => {
          if (!source.questionId) {
            return new GraphQLError(
              'this questionDetails field requires questionId field in query'
            )
          }

          return context.loaders.questionLoader
            .load(source.questionId)
            .then(question => question)
        }
      }
    })
  }
}

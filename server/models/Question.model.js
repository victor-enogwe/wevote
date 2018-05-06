import mongoose from 'mongoose'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import { schemaComposer } from 'graphql-compose'
import {
  modifyResolver,
  setGlobalResolvers,
  grantAccessAdmin as admin
} from '../middlewares'

const Schema = mongoose.Schema
const optionsSchema = new Schema({
  title: {
    type: String,
    required: true,
    validate: [{
      validator: value => /\w{0,255}/.test(value),
      message: 'option title must be string between 0 and 255 characters'
    }],
    index: true
  }
}, { _id: false })
const questionSchema = new Schema({
  question: { type: String, index: true, match: /\w{0,255}/, required: true },
  options: {
    type: [optionsSchema],
    validate: [{
      validator (value) {
        const options = value.map(option => option.title)
        const optionSet = new Set(options)

        return optionSet.size === options.length
      },
      message: 'options for this question must be unique'
    }],
    required: true
  },
  answer: {
    type: String,
    validate: [{
      validator (value) {
        return this.options.map(option => option.title).includes(value)
      },
      message: 'answer must be an option of this question'
    }],
    required: true
  },
  score: {
    type: Number,
    validate: [{
      validator: value => value >= 0,
      message: 'please enter a positive score'
    }],
    required: true,
    default: 0
  }
})

const subQuestionsSchema = questionSchema.clone()
subQuestionsSchema.remove('_id')
questionSchema.add({
  subQuestions: {
    type: [subQuestionsSchema],
    validate: [
      {
        validator: value => value.length <= 4,
        message: 'no more than 4 sub-questions can be added'
      },
      {
        validator (value) {
          const questions = value.map(question => question.question)
          const questionSet = new Set(questions)

          return questionSet.size === questions.length
        },
        message: 'sub-questions must be unique'
      }
    ]
  }
})

questionSchema.pre('save', function (next) {
  this.score = this.subQuestions.map(question => question.score)
    .reduce((a, b) => (a + b), 0)

  next()
})

const model = mongoose.model('Question', questionSchema)
const modelTC = composeWithMongoose(model)

setGlobalResolvers(model, modelTC, 'Question')

schemaComposer.rootQuery().addFields({
  QuestionFindOne: modelTC.getResolver('findOne'),
  QuestionFindById: modelTC.getResolver('findById'),
  QuestionFindByIds: modelTC.getResolver('findByIds'),
  QuestionFindMany: modelTC.getResolver('findMany'),
  QuestionCount: modelTC.getResolver('count'),
  QuestionConnection: modelTC.getResolver('connection'),
  QuestionPagination: modelTC.getResolver('pagination')
})

schemaComposer.rootMutation().addFields({
  QuestionCreateOne: modifyResolver(modelTC.getResolver('createOne'), admin),
  QuestionUpdateById: modifyResolver(modelTC.getResolver('updateById'), admin),
  QuestionRemoveById: modifyResolver(modelTC.getResolver('removeById'), admin)
})

const schema = schemaComposer.buildSchema()

module.exports.modelTC = modelTC
module.exports.model = model
export default { model, modelTC, schema }

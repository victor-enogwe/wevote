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
    }]
  },
  nextQuestionId: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    validate: [{
      validator: value => value >= 0,
      message: 'please enter a positive score'
    }],
    default: 0
  },
  recommendation: {
    type: String,
    validate: [{
      validator: value => /\w{0,255}/.test(value),
      message: 'recommendation must be string between 0 and 1000 characters'
    }]
  },
  externalData: {
    type: String
  }
}, { _id: false })
const questionSchema = new Schema({
  questionId: {
    type: String,
    match: /\d+/,
    required: true,
    unique: true
  },
  question: { type: String, index: true, match: /\w{0,255}/, required: true },
  label: {
    type: String,
    required: true,
    validate: [{
      validator: value => /\w{0,255}/.test(value),
      message: 'labbel must be string between 0 and 20 characters'
    }]
  },
  inputType: {
    type: String,
    enum: ['text', 'option', 'select', 'date', 'none'],
    required: true
  },
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
    index: false
  },
  nextQuestionId: {
    type: Number,
    required: true
  },
  externalData: {
    type: String
  },
  recommendation: {
    type: String,
    validate: [{
      validator: value => /\w{0,1000}/.test(value),
      message: 'recommendation must be string between 0 and 1000 characters'
    }]
  }
}, { autoIndex: false })

const subQuestionsSchema = questionSchema.clone()
const subOptionsSchema = optionsSchema.clone()
subQuestionsSchema.remove('_id')
subQuestionsSchema.remove('questionId')
subQuestionsSchema.remove('nextQuestionId')
subOptionsSchema.remove('nextQuestionId')
subQuestionsSchema.add({
  inputType: {
    type: String,
    enum: ['text', 'option', 'select', 'date'],
    required: true
  },
  options: {
    type: [subOptionsSchema],
    validate: [{
      validator (value) {
        const options = value.map(option => option.title)
        const optionSet = new Set(options)

        return optionSet.size === options.length
      },
      message: 'options for this question must be unique'
    }],
    index: false
  }
})
questionSchema.add({
  subQuestions: {
    type: [subQuestionsSchema],
    validate: [
      {
        validator: value => value.length <= 10,
        message: 'no more than 10 sub-questions can be added'
      },
      {
        validator (value) {
          const questions = value.map(question => question.question)
          const questionSet = new Set(questions)

          return questionSet.size === questions.length
        },
        message: 'sub-questions must be unique'
      }
    ],
    index: false
  }
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

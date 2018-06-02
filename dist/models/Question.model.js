'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _node = require('graphql-compose-mongoose/node8');

var _graphqlCompose = require('graphql-compose');

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var optionsSchema = new Schema({
  title: {
    type: String,
    required: true,
    validate: [{
      validator: function validator(value) {
        return (/\w{0,255}/.test(value)
        );
      },
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
      validator: function validator(value) {
        return value >= 0;
      },
      message: 'please enter a positive score'
    }],
    default: 0
  },
  recommendation: {
    type: String,
    validate: [{
      validator: function validator(value) {
        return (/\w{0,255}/.test(value)
        );
      },
      message: 'recommendation must be string between 0 and 1000 characters'
    }]
  },
  externalData: {
    type: String
  }
}, { _id: false });
var questionSchema = new Schema({
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
      validator: function validator(value) {
        return (/\w{0,255}/.test(value)
        );
      },
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
      validator: function validator(value) {
        var options = value.map(function (option) {
          return option.title;
        });
        var optionSet = new Set(options);

        return optionSet.size === options.length;
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
      validator: function validator(value) {
        return (/\w{0,255}/.test(value)
        );
      },
      message: 'recommendation must be string between 0 and 1000 characters'
    }]
  }
}, { autoIndex: false });

var subQuestionsSchema = questionSchema.clone();
var subOptionsSchema = optionsSchema.clone();
subQuestionsSchema.remove('_id');
subQuestionsSchema.remove('questionId');
subQuestionsSchema.remove('nextQuestionId');
subOptionsSchema.remove('nextQuestionId');
subQuestionsSchema.add({
  inputType: {
    type: String,
    enum: ['text', 'option', 'select', 'date'],
    required: true
  },
  options: {
    type: [subOptionsSchema],
    validate: [{
      validator: function validator(value) {
        var options = value.map(function (option) {
          return option.title;
        });
        var optionSet = new Set(options);

        return optionSet.size === options.length;
      },

      message: 'options for this question must be unique'
    }],
    index: false
  }
});
questionSchema.add({
  subQuestions: {
    type: [subQuestionsSchema],
    validate: [{
      validator: function validator(value) {
        return value.length <= 10;
      },
      message: 'no more than 10 sub-questions can be added'
    }, {
      validator: function validator(value) {
        var questions = value.map(function (question) {
          return question.question;
        });
        var questionSet = new Set(questions);

        return questionSet.size === questions.length;
      },

      message: 'sub-questions must be unique'
    }],
    index: false
  }
});

var model = _mongoose2.default.model('Question', questionSchema);
var modelTC = (0, _node.composeWithMongoose)(model);

(0, _middlewares.setGlobalResolvers)(model, modelTC, 'Question');

_graphqlCompose.schemaComposer.rootQuery().addFields({
  QuestionFindOne: modelTC.getResolver('findOne'),
  QuestionFindById: modelTC.getResolver('findById'),
  QuestionFindByIds: modelTC.getResolver('findByIds'),
  QuestionFindMany: modelTC.getResolver('findMany'),
  QuestionCount: modelTC.getResolver('count'),
  QuestionConnection: modelTC.getResolver('connection'),
  QuestionPagination: modelTC.getResolver('pagination')
});

_graphqlCompose.schemaComposer.rootMutation().addFields({
  QuestionCreateOne: (0, _middlewares.modifyResolver)(modelTC.getResolver('createOne'), _middlewares.grantAccessAdmin),
  QuestionUpdateById: (0, _middlewares.modifyResolver)(modelTC.getResolver('updateById'), _middlewares.grantAccessAdmin),
  QuestionRemoveById: (0, _middlewares.modifyResolver)(modelTC.getResolver('removeById'), _middlewares.grantAccessAdmin)
});

var schema = _graphqlCompose.schemaComposer.buildSchema();

module.exports.modelTC = modelTC;
module.exports.model = model;
exports.default = { model: model, modelTC: modelTC, schema: schema };
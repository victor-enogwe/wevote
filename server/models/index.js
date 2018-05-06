// This file dynamically imports and creates graphql schemas out of models. model file must be named singular
import dotenv from 'dotenv'
import fs from 'fs'
import mongoose from 'mongoose'
import { mergeSchemas } from 'graphql-tools'
import findOrCreate from './find-or-create.plugin'

mongoose.plugin(findOrCreate)

const graphqlSchemas = []
const modelTCS = {}
const relations = {}

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && ![
    'validation-error-transform.plugin.js',
    'find-or-create.plugin.js',
    'index.js'
  ].includes(file))
  .forEach((file) => {
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    const {
      model, schema, modelTC, addRelations = null
    } = require(`./${file}`).default
    const name = file.split('.')[0]
    module.exports[name] = model
    modelTCS[name] = modelTC
    if (addRelations) {
      relations[name] = addRelations
    }
    graphqlSchemas.push(schema)
  })

Object.keys(relations).map(name => relations[name](modelTCS))

dotenv.config()
mongoose.set('debug', process.env.NODE_ENV === 'development')
mongoose.Promise = Promise
mongoose.connect(process.env.MONGODB_URI)

export const database = mongoose.connection
module.exports.graphqlSchemas = graphqlSchemas
export const graphqlSchema = mergeSchemas({
  schemas: graphqlSchemas
})

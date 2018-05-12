import mongoose from 'mongoose'
import { schemaComposer } from 'graphql-compose'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import { modifyResolver, grantAccessAdmin as admin } from '../middlewares'

const Schema = mongoose.Schema
const roleSchema = new Schema({
  title: { type: String, required: true, unique: true }
}, { autoIndex: false })

const model = mongoose.model('Role', roleSchema)
const modelTC = composeWithMongoose(model)

schemaComposer.rootMutation().addFields({
  RoleCreateOne: modifyResolver(modelTC.getResolver('createOne'), admin),
  RoleUpdateOne: modifyResolver(modelTC.getResolver('updateOne'), admin)
})

const schema = schemaComposer.buildSchema()

module.exports.modelTC = modelTC
module.exports.model = model
export default { model, modelTC, schema }

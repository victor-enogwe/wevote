import mongoose from 'mongoose'
import { schemaComposer } from 'graphql-compose'
import { PubSub } from 'graphql-subscriptions'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import { modifyResolver, grantAccessAdmin as admin } from '../middlewares'

export const pubsub = new PubSub()
const Schema = mongoose.Schema
const notificationSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
    unique: true,
    validate: [{
      validator: value => value.length > 4 && value.length < 101,
      message: 'title should be between 5 to 100 characters'
    }]
  },
  message: {
    type: String,
    required: [true, 'message is required'],
    validate: [{
      validator: value => value.length > 19 && value.length < 1001,
      message: 'message should be between 20 to 1000 characters'
    }]
  }
}, { autoIndex: false, timestamps: true })

const model = mongoose.model('Notification', notificationSchema)
const modelTC = composeWithMongoose(model)

schemaComposer.rootQuery().addFields({
  NotificationConnection: modelTC.getResolver('connection'),
  NotificationPagination: modelTC.getResolver('pagination')
})

schemaComposer.rootMutation().addFields({
  NotificationCreateOne: modifyResolver({
    ...modelTC.getResolver('createOne'),
    resolve: async ({ source, args, context, info }) => {
      const result = await modelTC.getResolver('createOne')
        .resolve({ source, args, context, info })
      const { record } = result
      pubsub.publish('NewNotification', { NewNotification: record })

      return result
    }
  })
})
// modifyResolver(modelTC.getResolver('createOne'), admin)
schemaComposer.rootSubscription().addFields({
  NewNotification: {
    kind: 'subscription',
    type: modelTC.getType(),
    subscribe: () => pubsub.asyncIterator('NewNotification')
  }
})
const schema = schemaComposer.buildSchema()

module.exports.modelTC = modelTC
module.exports.model = model
export default { model, modelTC, schema }

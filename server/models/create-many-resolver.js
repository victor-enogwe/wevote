import type { MongooseModel } from 'mongoose'
import { GraphQLString } from 'graphql'
import { TypeComposer, Resolver } from 'graphql-compose'
import {
  recordHelperArgs
} from 'graphql-compose-mongoose/node8/resolvers/helpers'
import type {
  ExtendedResolveParams, GenResolverOpts
} from 'graphql-compose-mongoose/node8/index'

export default function createMany (
  model: MongooseModel,
  tc: TypeComposer,
  opts?: GenResolverOpts
): Resolver {
  if (!model || !model.modelName || !model.schema) {
    throw new Error('First arg for Resolver createMany() should be instance of Mongoose Model.')
  }
  if (!tc || tc.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver createMany() should be instance of TypeComposer.')
  }

  const outputTypeName = `CreateMany${tc.getTypeName()}Payload`
  const outputType = tc.constructor.schemaComposer
    .getOrCreateTC(outputTypeName, t => {
      t.addFields({
        message: {
          type: GraphQLString,
          description: 'New records created message'
        }
      })
    })
  const resolver = new tc.constructor.schemaComposer.Resolver({
    name: 'createMany',
    kind: 'mutation',
    description:
      'Create many documents without returning them: ' +
      'Use Query.create mongoose method. ' +
      'Do not apply mongoose defaults, setters, hooks and validation. ',
    type: outputType,
    args: {
      records: {
        type: [recordHelperArgs(tc, {
          recordTypeName: `CreateMany${tc.getTypeName()}Input`,
          removeFields: ['id', '_id'],
          isRequired: true,
          ...(opts && opts.record)
        }).record.type]
      }
    },
    resolve: async (resolveParams: ExtendedResolveParams) => {
      const recordData = (
        resolveParams.args && resolveParams.args.records
      ) || []

      if (!Array.isArray(recordData) || recordData.length === 0) {
        return Promise.reject(
          new Error(
            `${tc.getTypeName()}.createMany resolver requires ` +
              'at least one response in args.record'
          )
        )
      }

      const records = model.insertMany(recordData)

      return 'responses saved' || new Error(JSON.stringify(records))
    }
  })

  return resolver
}

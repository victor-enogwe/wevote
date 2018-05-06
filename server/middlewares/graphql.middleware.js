import { GraphQLError } from 'graphql'

export function modifyResolver (resolver, callback) {
  return {
    ...resolver,
    async resolve (...resolveParams) {
      const [ source, args, context, info ] = resolveParams
      if (callback && typeof callback === 'function') {
        return callback(args, info.fieldName, resolver.resolve
          .bind(null, { source, args, context, info }), context)
      }

      const result = await resolver
        .resolve({ source, args, context, info })

      return result
    }
  }
}

export function setGlobalResolvers (model, modelTC, modelName) {
  const findOrCreateType = modelTC.getResolver('createOne').getArgs()
  const findManyResolver = (modelTC, resolver) => modelTC
    .getResolver(resolver)
    .addFilterArg({
      name: 'search',
      type: 'String',
      description: `Search ${modelName} contents`,
      query: (rawQuery, value, resolveParams) => (rawQuery['$or'] = [
        'title',
        'displayName',
        'city',
        'address',
        'state'
      ].map(field => ({
        [field]: new RegExp(value.split(' ').join('|'), 'i')
      })))
    }).wrapResolve(next => rp => next(rp))

  modelTC.addResolver({
    name: 'findOrCreateOne',
    kind: 'mutation',
    type: modelTC.getResolver('createOne').getType(),
    args: {
      query: { type: findOrCreateType.record.type }, ...findOrCreateType
    },
    async resolve ({ source, args, context, info }) {
      const { doc: record } = await model
        .findOrCreate(args.query, args.record, { new: true })

      return { record, recordId: modelTC.getRecordIdFn()(record) }
    }
  })

  modelTC.setResolver('findMany', findManyResolver(modelTC, 'findMany'))
  modelTC.setResolver('pagination', findManyResolver(modelTC, 'pagination'))
  modelTC.setResolver('connection', modelTC.getResolver('connection')
    .addSortArg({ name: 'DATE_ASC', value: { createdAt: 1 } })
    .addSortArg({ name: 'DATE_DESC', value: { createdAt: -1 } })
  )
  modelTC.setResolver('pagination', modelTC.getResolver('pagination')
    .addSortArg({ name: 'DATE_ASC', value: { createdAt: 1 } })
    .addSortArg({ name: 'DATE_DESC', value: { createdAt: -1 } })
  )
}

export function grantAccessAdmin (...args) {
  const [name, resolver, context] = args.slice(1)
  const { user } = context
  const [field, operation] = name.match(/[A-Z][a-z]+/g)

  if (user.roleDetails.title !== 'ADMIN') {
    throw new GraphQLError(`you  dont have permission to ${operation
      .toLowerCase()} this ${field.toLowerCase()}`)
  }

  return resolver()
}

export function grantAccessAdminOrOwner (...args) {
  const [arg, name, resolver, context] = args
  const { user } = context
  const _id = arg.record ? arg.record._id : arg._id
  const [field, operation] = name.match(/[A-Z][a-z]+/g)

  if (user.roleDetails.title !== 'ADMIN' && user._id !== _id) {
    throw new GraphQLError(`you  dont have permission to ${operation
      .toLowerCase()} this ${field.toLowerCase()}`)
  }

  return resolver()
}

export function grantAccessUser (...args) {
  const [name, resolver, context] = args.slice(1)
  const { user } = context
  const [field, operation] = name.match(/[A-Z][a-z]+/g)

  if (!user._id) {
    throw new GraphQLError(`you  dont have permission to ${operation
      .toLowerCase()} this ${field.toLowerCase()}`)
  }

  return resolver()
}

export function grantAccessOwner (...args) {
  const [arg, name, resolver, context] = args
  const { user } = context
  const _id = arg.record ? arg.record._id : arg._id
  const [field, operation] = name.match(/[A-Z][a-z]+/g)

  if (user._id !== _id) {
    throw new GraphQLError(`you  dont have permission to ${operation
      .toLowerCase()} this ${field.toLowerCase()}`)
  }

  return resolver()
}

const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Item = require('../../entities/item')
const ItemRepository = require('../../../infra/data/repositories/itemRepository')

const dependency = { ItemRepository }

const createItem = injection =>
  usecase('Create Item', {
    // Input/Request metadata and validation 
    request: request.from(Item, { ignoreIDs: true }),

    // Output/Response metadata
    response: Item,

    //Authorization with Audit
    // authorize: (user) => (user.canCreateItem ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    //Step description and function
    'Check if the Item is valid': step(ctx => {
      ctx.item = Item.fromJSON(ctx.req)
      ctx.item.id = Math.floor(Math.random() * 100000).toString()
      
      if (!ctx.item.isValid()) 
        return Err.invalidEntity({
          message: 'The Item entity is invalid', 
          payload: { entity: 'Item' },
          cause: ctx.item.errors 
        })

      // returning Ok continues to the next step. Err stops the use case execution.
      return Ok() 
    }),

    'Save the Item': step(async ctx => {
      const repo = new ctx.di.ItemRepository(injection)
      const item = ctx.item
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.insert(item))
    })
  })

module.exports =
  herbarium.usecases
    .add(createItem, 'CreateItem')
    .metadata({ group: 'Item', operation: herbarium.crud.create, entity: Item })
    .usecase
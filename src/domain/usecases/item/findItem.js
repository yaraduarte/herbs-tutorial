const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Item = require('../../entities/item')
const ItemRepository = require('../../../infra/data/repositories/itemRepository')

const dependency = { ItemRepository }

const findItem = injection =>
  usecase('Find a Item', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Item,

    //Authorization with Audit
    // authorize: (user) => (user.canFindOneItem ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return the Item': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.ItemRepository(injection)
      const [item] = await repo.findByID(id)
      if (!item) return Err.notFound({ 
        message: `Item entity not found by ID: ${id}`,
        payload: { entity: 'Item', id }
      })
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = item)
    })
  })

module.exports =
  herbarium.usecases
    .add(findItem, 'FindItem')
    .metadata({ group: 'Item', operation: herbarium.crud.read, entity: Item })
    .usecase
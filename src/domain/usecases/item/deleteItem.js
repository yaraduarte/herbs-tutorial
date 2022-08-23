const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Item = require('../../entities/item')
const ItemRepository = require('../../../infra/data/repositories/itemRepository')

const dependency = { ItemRepository }

const deleteItem = injection =>
  usecase('Delete Item', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Boolean,

    //Authorization with Audit
    // authorize: (user) => (user.canDeleteItem ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the Item exist': step(async ctx => {
      const repo = new ctx.di.ItemRepository(injection)
      const [item] = await repo.findByID(ctx.req.id)
      ctx.item = item

      if (item) return Ok()
      return Err.notFound({
          message: `Item ID ${ctx.req.id} does not exist`,
          payload: { entity: 'Item' }
      })
    }),

    'Delete the Item': step(async ctx => {
      const repo = new ctx.di.ItemRepository(injection)
      ctx.ret = await repo.delete(ctx.item)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret)
    })
  })

module.exports =
  herbarium.usecases
    .add(deleteItem, 'DeleteItem')
    .metadata({ group: 'Item', operation: herbarium.crud.delete, entity: Item })
    .usecase
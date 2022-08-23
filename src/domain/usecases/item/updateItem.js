const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const Item = require('../../entities/item')
const ItemRepository = require('../../../infra/data/repositories/itemRepository')

const dependency = { ItemRepository }

const updateItem = injection =>
  usecase('Update Item', {
    // Input/Request metadata and validation 
    request: request.from(Item),

    // Output/Response metadata
    response: Item,

    //Authorization with Audit
    // authorize: (user) => (user.canUpdateItem ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Retrieve the Item': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.ItemRepository(injection)
      const [item] = await repo.findByID(id)
      ctx.item = item
      if (item === undefined) return Err.notFound({
        message: `Item not found - ID: ${id}`,
        payload: { entity: 'Item' }
      })

      return Ok(item)
    }),

    'Check if it is a valid Item before update': step(ctx => {
      const oldItem = ctx.item
      const newItem = Item.fromJSON(merge.all([ oldItem, ctx.req ]))
      ctx.item = newItem

      return newItem.isValid() ? Ok() : Err.invalidEntity({
        message: `Item is invalid`,
        payload: { entity: 'Item' },
        cause: newItem.errors
      })

    }),

    'Update the Item': step(async ctx => {
      const repo = new ctx.di.ItemRepository(injection)
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.update(ctx.item))
    })

  })

module.exports =
  herbarium.usecases
    .add(updateItem, 'UpdateItem')
    .metadata({ group: 'Item', operation: herbarium.crud.update, entity: Item })
    .usecase
const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Item = require('../../entities/item')
const ItemRepository = require('../../../infra/data/repositories/itemRepository')

const dependency = { ItemRepository }

const findAllItem = injection =>
  usecase('Find all Items', {
    // Input/Request metadata and validation
    request: {
      limit: Number,
      offset: Number
    },

    // Output/Response metadata
    response: [Item],

    //Authorization with Audit
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return all the Items': step(async ctx => {
      const repo = new ctx.di.ItemRepository(injection)
      const items = await repo.findAll(ctx.req)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = items)
    })
  })

module.exports =
  herbarium.usecases
    .add(findAllItem, 'FindAllItem')
    .metadata({ group: 'Item', operation: herbarium.crud.readAll, entity: Item })
    .usecase

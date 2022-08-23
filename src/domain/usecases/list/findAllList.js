const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const List = require('../../entities/list')
const ListRepository = require('../../../infra/data/repositories/listRepository')

const dependency = { ListRepository }

const findAllList = injection =>
  usecase('Find all Lists', {
    // Input/Request metadata and validation
    request: {
      limit: Number,
      offset: Number
    },

    // Output/Response metadata
    response: [List],

    //Authorization with Audit
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return all the Lists': step(async ctx => {
      const repo = new ctx.di.ListRepository(injection)
      const lists = await repo.findAll(ctx.req)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = lists)
    })
  })

module.exports =
  herbarium.usecases
    .add(findAllList, 'FindAllList')
    .metadata({ group: 'List', operation: herbarium.crud.readAll, entity: List })
    .usecase

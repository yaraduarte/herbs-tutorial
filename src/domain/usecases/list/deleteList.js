const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const List = require('../../entities/list')
const ListRepository = require('../../../infra/data/repositories/listRepository')

const dependency = { ListRepository }

const deleteList = injection =>
  usecase('Delete List', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: Boolean,

    //Authorization with Audit
    // authorize: (user) => (user.canDeleteList ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the List exist': step(async ctx => {
      const repo = new ctx.di.ListRepository(injection)
      const [list] = await repo.findByID(ctx.req.id)
      ctx.list = list

      if (list) return Ok()
      return Err.notFound({
          message: `List ID ${ctx.req.id} does not exist`,
          payload: { entity: 'List' }
      })
    }),

    'Delete the List': step(async ctx => {
      const repo = new ctx.di.ListRepository(injection)
      ctx.ret = await repo.delete(ctx.list)
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret)
    })
  })

module.exports =
  herbarium.usecases
    .add(deleteList, 'DeleteList')
    .metadata({ group: 'List', operation: herbarium.crud.delete, entity: List })
    .usecase
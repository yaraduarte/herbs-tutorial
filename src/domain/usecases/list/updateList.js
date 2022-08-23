const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const List = require('../../entities/list')
const ListRepository = require('../../../infra/data/repositories/listRepository')

const dependency = { ListRepository }

const updateList = injection =>
  usecase('Update List', {
    // Input/Request metadata and validation 
    request: request.from(List),

    // Output/Response metadata
    response: List,

    //Authorization with Audit
    // authorize: (user) => (user.canUpdateList ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Retrieve the List': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.ListRepository(injection)
      const [list] = await repo.findByID(id)
      ctx.list = list
      if (list === undefined) return Err.notFound({
        message: `List not found - ID: ${id}`,
        payload: { entity: 'List' }
      })

      return Ok(list)
    }),

    'Check if it is a valid List before update': step(ctx => {
      const oldList = ctx.list
      const newList = List.fromJSON(merge.all([ oldList, ctx.req ]))
      ctx.list = newList

      return newList.isValid() ? Ok() : Err.invalidEntity({
        message: `List is invalid`,
        payload: { entity: 'List' },
        cause: newList.errors
      })

    }),

    'Update the List': step(async ctx => {
      const repo = new ctx.di.ListRepository(injection)
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.update(ctx.list))
    })

  })

module.exports =
  herbarium.usecases
    .add(updateList, 'UpdateList')
    .metadata({ group: 'List', operation: herbarium.crud.update, entity: List })
    .usecase
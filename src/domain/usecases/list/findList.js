const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const List = require('../../entities/list')
const ListRepository = require('../../../infra/data/repositories/listRepository')

const dependency = { ListRepository }

const findList = injection =>
  usecase('Find a List', {
    // Input/Request metadata and validation 
    request: {
      id: String
    },

    // Output/Response metadata
    response: List,

    //Authorization with Audit
    // authorize: (user) => (user.canFindOneList ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return the List': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.ListRepository(injection)
      const [list] = await repo.findByID(id)
      if (!list) return Err.notFound({ 
        message: `List entity not found by ID: ${id}`,
        payload: { entity: 'List', id }
      })
      // ctx.ret is the return value of a use case
      return Ok(ctx.ret = list)
    })
  })

module.exports =
  herbarium.usecases
    .add(findList, 'FindList')
    .metadata({ group: 'List', operation: herbarium.crud.read, entity: List })
    .usecase
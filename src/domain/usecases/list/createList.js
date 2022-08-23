const { usecase, step, Ok, Err, request } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const List = require('../../entities/list')
const ListRepository = require('../../../infra/data/repositories/listRepository')

const dependency = { ListRepository }

const createList = injection =>
  usecase('Create List', {
    // Input/Request metadata and validation 
    request: request.from(List, { ignoreIDs: true }),

    // Output/Response metadata
    response: List,

    //Authorization with Audit
    // authorize: (user) => (user.canCreateList ? Ok() : Err()),
    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    //Step description and function
    'Check if the List is valid': step(ctx => {
      ctx.list = List.fromJSON(ctx.req)
      ctx.list.id = Math.floor(Math.random() * 100000)
      
      if (!ctx.list.isValid()) 
        return Err.invalidEntity({
          message: 'The List entity is invalid', 
          payload: { entity: 'List' },
          cause: ctx.list.errors 
        })

      // returning Ok continues to the next step. Err stops the use case execution.
      return Ok() 
    }),

    'Save the List': step(async ctx => {
      const repo = new ctx.di.ListRepository(injection)
      const list = ctx.list
      // ctx.ret is the return value of a use case
      return (ctx.ret = await repo.insert(list)
      .catch(ex => {
        return Err(ex)
      }))
    })
  })

module.exports =
  herbarium.usecases
    .add(createList, 'CreateList')
    .metadata({ group: 'List', operation: herbarium.crud.create, entity: List })
    .usecase
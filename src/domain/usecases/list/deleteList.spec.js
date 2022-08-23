const List = require('../../entities/list')
const deleteList = require('./deleteList')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteListSpec = spec({

    usecase: deleteList,
  
    'Delete list if exists': scenario({
      'Given an existing list': given({
        request: {
            id: 99
        },
        user: { hasAccess: true },
        injection:{
            ListRepository: class ListRepository {
                async delete(entity) { return true }
                async findByID(id) { return [List.fromJSON({ id })] }            }
        },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must confirm deletion': check((ctx) => {
        assert.ok(ctx.response.ok === true)
      })

    }),

    'Do not delete list if it does not exist': scenario({
        'Given an empty list repository': given({
          request: {
              id: 99
          },
          user: { hasAccess: true },
          injection:{
            ListRepository: class ListRepository {
              async findByID(id) { return [] }
            }
          },
        }),
  
        // when: default when for use case
  
        'Must return an error': check((ctx) => {
          assert.ok(ctx.response.isErr)
          assert.ok(ctx.response.isNotFoundError)  
        }),
      }),
  })
  
module.exports =
  herbarium.specs
    .add(deleteListSpec, 'DeleteListSpec')
    .metadata({ usecase: 'DeleteList' })
    .spec
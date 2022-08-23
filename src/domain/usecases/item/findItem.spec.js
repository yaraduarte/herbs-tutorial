const Item = require('../../entities/item')
const findItem = require('./findItem')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findItemSpec = spec({

    usecase: findItem,
  
    'Find a item when it exists': scenario({
      'Given an existing item': given({
        request: {
            id: 99
        },
        user: { hasAccess: true },
        injection: {
            ItemRepository: class ItemRepository {
              async findByID(id) { 
                  const fakeItem = {
                    id: 99,
        name: 'a text',
        completed: true
                  }
                  return ([Item.fromJSON(fakeItem)])
              }
            }
          },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must return a valid item': check((ctx) => {
        assert.strictEqual(ctx.response.ok.isValid(), true)
      })

    }),

    'Do not find a item when it does not exist': scenario({
        'Given an empty item repository': given({
            request: {
                id: 99
            },
            user: { hasAccess: true },
            injection:{
              ItemRepository: class ItemRepository {
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
    .add(findItemSpec, 'FindItemSpec')
    .metadata({ usecase: 'FindItem' })
    .usecase
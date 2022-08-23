const Item = require('../../entities/item')
const findAllItem = require('./findAllItem')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllItemSpec = spec({

    usecase: findAllItem,
  
    'Find all items': scenario({
      'Given an existing item': given({
        request: { limit: 0, offset: 0 },
        user: { hasAccess: true },
        injection: {
            ItemRepository: class ItemRepository {
              async findAll(id) { 
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

      'Must return a list of items': check((ctx) => {
        assert.strictEqual(ctx.response.ok.length, 1)
      })

    }),

  })
  
module.exports =
  herbarium.specs
    .add(findAllItemSpec, 'FindAllItemSpec')
    .metadata({ usecase: 'FindAllItem' })
    .spec
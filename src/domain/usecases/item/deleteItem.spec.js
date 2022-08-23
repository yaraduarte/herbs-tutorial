const Item = require('../../entities/item')
const deleteItem = require('./deleteItem')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const deleteItemSpec = spec({

    usecase: deleteItem,
  
    'Delete item if exists': scenario({
      'Given an existing item': given({
        request: {
            id: 99
        },
        user: { hasAccess: true },
        injection:{
            ItemRepository: class ItemRepository {
                async delete(entity) { return true }
                async findByID(id) { return [Item.fromJSON({ id })] }            }
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

    'Do not delete item if it does not exist': scenario({
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
    .add(deleteItemSpec, 'DeleteItemSpec')
    .metadata({ usecase: 'DeleteItem' })
    .spec
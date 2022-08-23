const Item = require('../../entities/item')
const updateItem = require('./updateItem')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateItemSpec = spec({

    usecase: updateItem,
    'Update a existing item when it is valid': scenario({

      'Valid items': samples([
        {
          id: 99,
        name: 'a text',
        completed: true
        },
        {
          id: 99,
        name: 'a text',
        completed: true
        }
      ]),
      
      'Valid items': samples([
        {
          id: 99,
        name: 'a text',
        completed: true
        },
        {
          id: 99,
        name: 'a text',
        completed: true
        }
      ]),

      'Given a valid item': given((ctx) => ({
        request: ctx.sample,
        user: { hasAccess: true }
      })),

      'Given a repository with a existing item': given((ctx) => ({
        injection: {
            ItemRepository: class ItemRepository {
              async findByID(id) { 
                const fakeItem = {
                    id: 99,
        name: 'a text',
        completed: true
                }
                return ([Item.fromJSON(fakeItem)])              }
              async update(id) { return true }
            }
          },
      })),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must confirm update': check((ctx) => {
        assert.ok(ctx.response.ok === true)
      })

    }),

    'Do not update a item when it is invalid': scenario({
      'Given a invalid item': given({
        request: {
          id: true,
        name: true,
        completed: true
        },
        user: { hasAccess: true },
        injection: {},
      }),

      // when: default when for use case

      'Must return an error': check((ctx) => {
        assert.ok(ctx.response.isErr)  
        // assert.ok(ctx.response.isInvalidEntityError)
      }),

    }),

    'Do not update item if it does not exist': scenario({
        'Given an empty item repository': given({
          request: {
              id: 99,
        name: 'a text',
        completed: true
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
    .add(updateItemSpec, 'UpdateItemSpec')
    .metadata({ usecase: 'UpdateItem' })
    .spec
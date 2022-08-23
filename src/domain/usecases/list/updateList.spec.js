const List = require('../../entities/list')
const updateList = require('./updateList')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const updateListSpec = spec({

    usecase: updateList,
    'Update a existing list when it is valid': scenario({

      'Valid lists': samples([
        {
          id: 99,
        name: 'a text',
        description: 'a text'
        },
        {
          id: 99,
        name: 'a text',
        description: 'a text'
        }
      ]),
      
      'Valid lists': samples([
        {
          id: 99,
        name: 'a text',
        description: 'a text'
        },
        {
          id: 99,
        name: 'a text',
        description: 'a text'
        }
      ]),

      'Given a valid list': given((ctx) => ({
        request: ctx.sample,
        user: { hasAccess: true }
      })),

      'Given a repository with a existing list': given((ctx) => ({
        injection: {
            ListRepository: class ListRepository {
              async findByID(id) { 
                const fakeList = {
                    id: 99,
        name: 'a text',
        description: 'a text'
                }
                return ([List.fromJSON(fakeList)])              }
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

    'Do not update a list when it is invalid': scenario({
      'Given a invalid list': given({
        request: {
          id: true,
        name: true,
        description: true
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

    'Do not update list if it does not exist': scenario({
        'Given an empty list repository': given({
          request: {
              id: 99,
        name: 'a text',
        description: 'a text'
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
    .add(updateListSpec, 'UpdateListSpec')
    .metadata({ usecase: 'UpdateList' })
    .spec
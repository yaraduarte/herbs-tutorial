const createList = require('./createList')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const createListSpec = spec({

    usecase: createList,
  
    'Create a new list when it is valid': scenario({
      'Given a valid list': given({
        request: {
            name: 'a text',
        description: 'a text'
        },
        user: { hasAccess: true },
        injection: {
            ListRepository: class ListRepository {
              async insert(list) { return (list) }
            }
        },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must return a valid list': check((ctx) => {
        assert.strictEqual(ctx.response.ok.isValid(), true)
        // TODO: check if it is really a list
      })

    }),

    'Do not create a new list when it is invalid': scenario({
      'Given a invalid list': given({
        request: {
          name: true,
        description: true
        },
        user: { hasAccess: true },
        injection: {
            listRepository: new ( class ListRepository {
              async insert(list) { return (list) }
            })
        },
      }),

      // when: default when for use case

      'Must return an error': check((ctx) => {
        assert.ok(ctx.response.isErr)  
        // assert.ok(ret.isInvalidEntityError)
      }),

    }),
  })
  
module.exports =
  herbarium.specs
    .add(createListSpec, 'CreateListSpec')
    .metadata({ usecase: 'CreateList' })
    .spec
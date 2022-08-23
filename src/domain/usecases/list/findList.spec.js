const List = require('../../entities/list')
const findList = require('./findList')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findListSpec = spec({

    usecase: findList,
  
    'Find a list when it exists': scenario({
      'Given an existing list': given({
        request: {
            id: 99
        },
        user: { hasAccess: true },
        injection: {
            ListRepository: class ListRepository {
              async findByID(id) { 
                  const fakeList = {
                    id: 99,
        name: 'a text',
        description: 'a text'
                  }
                  return ([List.fromJSON(fakeList)])
              }
            }
          },
      }),

      // when: default when for use case

      'Must run without errors': check((ctx) => {
        assert.ok(ctx.response.isOk)  
      }),

      'Must return a valid list': check((ctx) => {
        assert.strictEqual(ctx.response.ok.isValid(), true)
      })

    }),

    'Do not find a list when it does not exist': scenario({
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
    .add(findListSpec, 'FindListSpec')
    .metadata({ usecase: 'FindList' })
    .usecase
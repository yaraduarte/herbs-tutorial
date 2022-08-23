const List = require('../../entities/list')
const findAllList = require('./findAllList')
const assert = require('assert')
const { spec, scenario, given, check, samples } = require('@herbsjs/herbs').specs
const { herbarium } = require('@herbsjs/herbarium')

const findAllListSpec = spec({

    usecase: findAllList,
  
    'Find all lists': scenario({
      'Given an existing list': given({
        request: { limit: 0, offset: 0 },
        user: { hasAccess: true },
        injection: {
            ListRepository: class ListRepository {
              async findAll(id) { 
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

      'Must return a list of lists': check((ctx) => {
        assert.strictEqual(ctx.response.ok.length, 1)
      })

    }),

  })
  
module.exports =
  herbarium.specs
    .add(findAllListSpec, 'FindAllListSpec')
    .metadata({ usecase: 'FindAllList' })
    .spec
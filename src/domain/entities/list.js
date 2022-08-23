const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const List = entity('List', { 
    id: id(Number, {
        validation: {
            // The field MUST be present
            presence: true,
        }
    }),
    name: field(String, {
        validation: {
            // The field MUST be present
            presence: true,
             // Here, the name MUST have 3 letters at least
            length: { minimum: 3 },
        }
    }),
    description: field(String)
})

module.exports =
    herbarium.entities
        .add(List, 'List')
        .entity

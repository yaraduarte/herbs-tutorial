//start a file importing dependencies:
const { entity, id, field } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

/*
create a const Item and assign a entity() 
passing all arguments needed with fields for the item
*/

const Item = entity('Item', { 
    id: id(Number),
    name: field(String),
    completed: field(Boolean, {
        default: false
    })
})

// finally exports Item entity
module.exports =
herbarium.entities
    .add(Item, 'Item')
    .entity

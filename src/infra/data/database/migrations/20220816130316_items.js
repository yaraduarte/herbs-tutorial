
exports.up = async function (knex) {
    knex.schema.hasTable('items')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('items', function (table) {
                    table.integer('id').primary()
                    table.string('name')
                    table.boolean('completed')
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('items')
}

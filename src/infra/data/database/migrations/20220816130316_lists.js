
exports.up = async function (knex) {
    knex.schema.hasTable('lists')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('lists', function (table) {
                    table.integer('id').primary()
                    table.string('name')
                    table.string('description')
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('lists')
}

const { Repository } = require("@herbsjs/herbs2knex")
const { herbarium } = require('@herbsjs/herbarium')
const Item = require('../../../domain/entities/item')
const connection = require('../database/connection')

class ItemRepository extends Repository {
    constructor(injection) {
        super({
            entity: Item,
            table: "items",
            knex: connection
        })
    }
}

module.exports =
    herbarium.repositories
        .add(ItemRepository, 'ItemRepository')
        .metadata({ entity: Item })
        .repository
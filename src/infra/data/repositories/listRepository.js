const { Repository } = require("@herbsjs/herbs2knex")
const { herbarium } = require('@herbsjs/herbarium')
const List = require('../../../domain/entities/list')
const connection = require('../database/connection')

class ListRepository extends Repository {
    constructor(injection) {
        super({
            entity: List,
            table: "lists",
            knex: connection
        })
    }
}

module.exports =
    herbarium.repositories
        .add(ListRepository, 'ListRepository')
        .metadata({ entity: List })
        .repository
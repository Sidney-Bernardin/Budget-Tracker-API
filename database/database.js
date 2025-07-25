import pg from "pg"


export class NotFoundError extends Error {
    constructor(entity) {
        super(`${entity} not found`)
        this.name = "NotFoundError"
    }
}


export const client = new pg.Client(process.env.POSTGRES_URL)
await client.connect()

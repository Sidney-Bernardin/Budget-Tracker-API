import pg from "pg"


export class DatabaseError extends Error {
    constructor(type, message) {
        super(`${type}: ${message}`)
        this.name = "DatabaseError"
        this.type = type
    }
}

export const databaseErrorTypeEntityNotFound = "entity-not-found"


export const client = new pg.Pool({ connectionString: process.env.POSTGRES_URL, })

export async function transaction(cb) {
    await client.query("BEGIN")

    try {
        cb()
    } catch (err) {
        await client.query("ROLLBACK")
    }
}

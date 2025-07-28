import pg from "pg"


export class DatabaseError extends Error {
    constructor(entity, type) {
        super(`${entity}: ${type}`)
        this.name = "DatabaseError"
        this.entity = entity
        this.type = type
    }
}

export const entityEnvelope = "envelope"
export const entityTransaction = "transaction"

export const databaseErrorTypeEntityNotFound = "entity-not-found"


export const client = new pg.Pool({ connectionString: process.env.POSTGRES_URL })

export async function transaction(cb) {
    await client.query("BEGIN")

    try {
        const ret = await cb()
        await client.query("COMMIT")
        return ret
    } catch (err) {
        await client.query("ROLLBACK")
        throw err
    }
}

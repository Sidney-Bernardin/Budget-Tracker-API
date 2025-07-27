import * as database from './database.js'

const qInsertEnvelope = `
    INSERT INTO envelopes (title, money)
    VALUES ($1, $2)
    RETURNING *`
export async function insertEnvelope({ title, money }) {
    const result = await database.client.query(qInsertEnvelope, [title, money])
    return result.rows[0]
}

const qSelectEnvelopes = `SELECT * FROM envelopes`
export async function selectEnvelopes() {
    return (await database.client.query(qSelectEnvelopes)).rows
}

const qSelectEnvelopeByID = `SELECT * FROM envelopes WHERE id = $1`
export async function selectEnvelopeByID(envelopeID) {
    const result = await database.client.query(qSelectEnvelopeByID, [envelopeID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.databaseErrorTypeEntityNotFound, "Envelope not found.")

    return result.rows[0]
}

const qUpdateEnvelopeByID = `
    UPDATE envelopes
    SET
        title = $1,
        money = $2
    WHERE id = $3
    RETURNING *`
export async function updateEnvelope(envelopeID, { title, money }) {
    const result = await database.client.query(qUpdateEnvelopeByID, [title, money, envelopeID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.databaseErrorTypeEntityNotFound, "Envelope not found.")

    return result.rows[0]
}

const qDeleteEnvelopeByID = `DELETE FROM envelopes WHERE id = $1`
export async function deleteEnvelope(envelopeID) {
    const result = await database.client.query(qDeleteEnvelopeByID, [envelopeID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.databaseErrorTypeEntityNotFound, "Envelope not found.")
}

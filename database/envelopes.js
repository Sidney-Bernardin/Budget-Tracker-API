import * as database from './database.js'

const qInsertEnvelope = `
    INSERT INTO envelopes (title, money)
    VALUES ($1, $2)
    RETURNING *`
export async function insertEnvelope({ title, money }) {
    (await database.client.query(qInsertEnvelope, [title, money])).rows[0]
}

const qSelectEnvelopes = `SELECT * FROM envelopes`
export async function selectEnvelopes() {
    return (await database.client.query(qSelectEnvelopes)).rows
}

const qSelectEnvelopeByID = `SELECT * FROM envelopes WHERE id = $1`
export async function selectEnvelopeByID(envelopeID) {
    const result = await database.client.query(qSelectEnvelopeByID, [envelopeID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.entityEnvelope, database.databaseErrorTypeEntityNotFound)

    return result.rows[0]
}

const qUpdateEnvelopeByID = `
    UPDATE envelopes
    SET
        title = COALESCE($1, title),
        money = COALESCE($2, money)
    WHERE id = $3
    RETURNING *`
export async function updateEnvelopeByID(envelopeID, { title, money }) {
    const result = await database.client.query(qUpdateEnvelopeByID, [title, money, envelopeID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.entityEnvelope, database.databaseErrorTypeEntityNotFound)

    return result.rows[0]
}

const qAddEnvelopeMoneyByID = `
    UPDATE envelopes
    SET money = money + $1
    WHERE id = $2`
export async function addEnvelopeMoneyByID(envelopeID, money) {
    const result = await database.client.query(qAddEnvelopeMoneyByID, [money, envelopeID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.entityEnvelope, database.databaseErrorTypeEntityNotFound)
}

const qDeleteEnvelopeByID = `DELETE FROM envelopes WHERE id = $1`
export async function deleteEnvelopeByID(envelopeID) {
    const result = await database.client.query(qDeleteEnvelopeByID, [envelopeID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.entityEnvelope, database.databaseErrorTypeEntityNotFound)
}

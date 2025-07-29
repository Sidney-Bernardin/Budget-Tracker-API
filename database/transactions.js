import * as database from './database.js'

const qInsertTransaction = `
    INSERT INTO transactions (envelope_id, title, price)
    VALUES ($1, $2, $3)
    RETURNING *`
export async function insertTransaction({ envelopeID, title, price }) {
    try {
        return (await database.client.query(qInsertTransaction, [envelopeID, title, price])).rows[0]
    } catch (err) {
        if (err.code === "23503")
            throw new database.DatabaseError(database.entityEnvelope, database.databaseErrorTypeEntityNotFound)
    }
}

const qSelectTransactions = `SELECT * FROM transactions`
export async function selectTransactions() {
    return (await database.client.query(qSelectTransactions)).rows
}

const qSelectTransactionByID = `SELECT * FROM transactions WHERE id = $1`
export async function selectTransactionByID(transactionID) {
    const result = await database.client.query(qSelectTransactionByID, [transactionID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.entityTransaction, database.databaseErrorTypeEntityNotFound)

    return result.rows[0]
}

const qUpdateTransactionByID = `
    UPDATE transactions
    SET
        title = COALESCE($1, title),
        price = COALESCE($2, price)
    WHERE id = $3
    RETURNING *`
export async function updateTransactionByID(transactionID, { title, price }) {
    const result = await database.client.query(qUpdateTransactionByID, [title, price, transactionID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.entityTransaction, database.databaseErrorTypeEntityNotFound)

    return result.rows[0]
}

const qDeleteTransaction = `DELETE FROM transactions WHERE id = $1`
export async function deleteTransactionByID(transactionID) {
    const result = await database.client.query(qDeleteTransaction, [transactionID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.entityTransaction, database.databaseErrorTypeEntityNotFound)
}

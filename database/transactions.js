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

export async function updateTransactionByID(transactionID, { newTitle, newPrice }) {
    try {
        await database.client.query("BEGIN")

        let oldPrice = await database.client.query(`
            SELECT price
            FROM transactions
            WHERE id = $1
        `, [transactionID])

        if (oldPrice.rowCount < 1) {
            throw new database.NotFoundError("Transaction")
        }

        const envelopeUpdateResult = await database.client.query(`
            UPDATE envelopes
            SET money = (money + $1) - $2
            WHERE id IN (SELECT envelope_id FROM transactions WHERE id = $3)
        `, [oldPrice.rows[0]["price"], newPrice, transactionID])

        if (envelopeUpdateResult.rowCount < 1) {
            throw new Error("envelope not found")
        }

        const newTransaction = await database.client.query(`
            UPDATE transactions
            SET
                title = $1,
                price = $2
            WHERE id = $3
            RETURNING *
        `, [newTitle, newPrice, transactionID])

        if (envelopeUpdateResult.rowCount < 1) {
            throw new Error("transaction not found")
        }

        await database.client.query("COMMIT")
        return newTransaction.rows[0]
    } catch (e) {
        await database.client.query("ROLLBACK")
        throw e
    }
}

const qDeleteTransaction = `DELETE FROM transactions WHERE id = $1`
export async function deleteTransactionByID(transactionID) {
    const result = await database.client.query(qDeleteTransaction, [transactionID])
    if (result.rowCount < 1)
        throw new database.DatabaseError(database.entityTransaction, database.databaseErrorTypeEntityNotFound)
}

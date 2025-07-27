import * as db from './database.js'

const qInsertTransaction = `
    INSERT INTO transactions (envelope_id, title, price)
    VALUES ($1, $2, $3)
    RETURNING *`
export async function insertTransaction({ envelopeID, title, price }) {
    const result = await db.client.query(qInsertTransaction, [envelopeID, title, price])
    // TODO: handle foreign envelope err
    return result.rows[0]
}

const qSelectTransactions = `SELECT * FROM transactions`
export async function selectTransactions() {
    return (await db.client.query(qSelectTransactions)).rows
}

const qSelectTransactionByID = `SELECT * FROM transactions WHERE id = $1`
export async function selectTransactionByID(transactionID) {
    const result = await db.client.query(qSelectTransactionByID, [transactionID])
    if (result.rowCount < 1) {
        throw new db.NotFoundError("Transaction")
    }
    return result.rows[0]
}

export async function updateTransaction(transactionID, { newTitle, newPrice }) {
    try {
        await db.client.query("BEGIN")

        let oldPrice = await db.client.query(`
            SELECT price
            FROM transactions
            WHERE id = $1
        `, [transactionID])

        if (oldPrice.rowCount < 1) {
            throw new db.NotFoundError("Transaction")
        }

        const envelopeUpdateResult = await db.client.query(`
            UPDATE envelopes
            SET money = (money + $1) - $2
            WHERE id IN (SELECT envelope_id FROM transactions WHERE id = $3)
        `, [oldPrice.rows[0]["price"], newPrice, transactionID])

        if (envelopeUpdateResult.rowCount < 1) {
            throw new Error("envelope not found")
        }

        const newTransaction = await db.client.query(`
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

        await db.client.query("COMMIT")
        return newTransaction.rows[0]
    } catch (e) {
        await db.client.query("ROLLBACK")
        throw e
    }
}

const qDeleteTransaction = `DELETE FROM transactions WHERE id = $1`
export async function deleteTransaction(transactionID) {
    const result = await db.client.query(qDeleteTransaction, [transactionID])
    if (result.rowCount < 1) {
        throw new db.NotFoundError("Transaction")
    }
}

import express from "express"
import * as uuid from "uuid"

import * as db from "../database/database.js"
import * as dbTransactions from "../database/transactions.js"
import * as dbEnvelopes from "../database/envelopes.js"
import * as domain from "./domain.js"


export async function createTransaction({ envelopeID, title, price }) {
    if (!uuid.validate(envelopeID))
        throw new domain.DomainError(domain.domainErrorTypeUUIDInvalid, "Envelope-ID isn't a valid UUID.")
    if (!title || title === "")
        throw new domain.DomainError(domain.domainErrorTypeTransactionTitleInvalid, "Transaction title cannot be empty.")
    if (!price || price < 0)
        throw new domain.DomainError(domain.domainErrorTypeTransactionPriceInvalid, "Transaction price must be zero or more.")

    return await db.transaction(async () => {
        try {
            await dbEnvelopes.addEnvelopeMoneyByID(envelopeID, -price)
        } catch (err) {
            if (err.name === "DatabaseError" && err.type === db.databaseErrorTypeEntityNotFound)
                throw new domain.DomainError(domain.domainErrorTypeEnvelopeNotFound, "Envelope not found.")
        }

        return await dbTransactions.insertTransaction({ envelopeID, title, price, })
    })
}

export async function getTransactions() {
    return await dbTransactions.selectTransactions()
}

export async function getTransactionByID(transactionID) {
    if (!uuid.validate(transactionID))
        throw new domain.DomainError(domain.domainErrorTypeUUIDInvalid, "Transaction-ID isn't a valid UUID.")

    try {
        return await dbTransactions.selectTransactionByID(transactionID)
    } catch (err) {
        if (err.name === "DatabaseError" && err.type === db.databaseErrorTypeEntityNotFound)
            throw new domain.DomainError(domain.domainErrorTypeTransactionNotFound, "Transaction not found.")

        throw err
    }
}

export async function updateTransactionByID(transactionID, { title, price }) {
    if (!uuid.validate(transactionID))
        throw new domain.DomainError(domain.domainErrorTypeUUIDInvalid, "Transaction-ID isn't a valid UUID.")

    return await db.transaction(async () => {
        try {
            var oldTransaction = await dbTransactions.selectTransactionByID(transactionID)
        } catch (err) {
            if (err.name === "DatabaseError" && err.type === db.databaseErrorTypeEntityNotFound)
                throw new domain.DomainError(domain.domainErrorTypeTransactionNotFound, "Transaction not found.")
        }

        let diff = (oldTransaction.price + price)
        if (diff >= 0) diff = -diff

        await dbEnvelopes.addEnvelopeMoneyByID(oldTransaction.envelope_id, -oldTransaction.price + price)
        return await dbTransactions.updateTransactionByID(transactionID, { title, price })
    })
}

export async function deleteTransaction(transactionID) {
    if (!uuid.validate(transactionID))
        throw new domain.DomainError(domain.domainErrorTypeUUIDInvalid, "Transaction-ID isn't a valid UUID.")

    return await db.transaction(async () => {
        try {
            var oldTransaction = await dbTransactions.selectTransactionByID(transactionID)
        } catch (err) {
            if (err.name === "DatabaseError" && err.type === db.databaseErrorTypeEntityNotFound)
                throw new domain.DomainError(domain.domainErrorTypeTransactionNotFound, "Transaction not found.")
        }

        await dbEnvelopes.addEnvelopeMoneyByID(oldTransaction.envelope_id, -oldTransaction.price)
        await dbTransactions.deleteTransactionByID(transactionID)
    })
}

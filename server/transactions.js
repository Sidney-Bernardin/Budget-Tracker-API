import express from "express"

import * as db from "../database/database.js"
import * as domainTransactions from "../domain/transactions.js"


export const router = express.Router()

router.post("/", async (req, res) => {
    if (!req.body)
        throw new server.ServerError(server.serverErrorTypeInvalidRequestBody, "Request body cannot be empty.")

    return res.status(201).send(await domainTransactions.createTransaction({
        envelopeID: req.body.envelopeID,
        title: req.body.title,
        price: req.body.price,
    }))
})

router.get("/", async (req, res) => {
    if (req.query.id)
        return res.send(await domainTransactions.getTransactionByID(req.query.id))

    return res.send(await domainTransactions.getTransactions())
})

router.put("/:transactionID", async (req, res) => {
    if (!req.body)
        throw new server.ServerError(server.serverErrorTypeInvalidRequestBody, "Request body cannot be empty.")

    return res.status(200).send(await domainTransactions.updateTransactionByID(req.params.transactionID, {
        title: req.body.title,
        price: req.body.price,
    }))
})

router.delete("/:transactionID", async (req, res) =>
    res.status(204).send(await domainTransactions.deleteTransaction(req.params.transactionID)))

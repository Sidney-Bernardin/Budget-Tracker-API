import express from "express"

import * as db from "../database/database.js"
import * as dbTransactions from "../database/transactions.js"


export const router = express.Router()


router.get("/", async (req, res) => {
    if (req.query.id)
        return res.send(await dbTransactions.selectTransactionByID())
    else
        return res.send(await dbTransactions.selectTransactions())
})

router.post("/", async (req, res) => {
    if (!req.body) return res.status(400).send("no request body")
    if (!req.body.envelopeID) return res.status(400).send("envelopeID cannot be null")

    return res.status(201).send(await dbTransactions.insertTransaction({
        envelopeID: req.body.envelopeID,
        title: req.body.title || "",
        price: req.body.price || 0,
    }))
})

router.put("/:transactionID", async (req, res) => {
    if (!req.body) return res.status(400).send("no request body")

    return res.status(200).send(await dbTransactions.updateTransaction(req.params.transactionID, {
        title: req.body.title || "",
        price: req.body.price || 0,
    }))
})
//
//router.delete("/:transactionID", async (req, res) =>
//    res.status(204).send(await dbTransactions.deleteTransaction(req.params.transactionID)))

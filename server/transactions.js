import express from "express"

import * as db from "../database/database.js"
import * as domainTransactions from "../domain/transactions.js"


export const router = express.Router()

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction.
 *     produces:
 *       - application/json
 *     tags:
 *       - Transactions
 *     requestBody:
 *       description: Transaction fields.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               envelope_id:
 *                  type: string
 *               title:
 *                 type: string
 *               price:
 *                 type: float
 *             example:
 *               envelope_id: "123"
 *               title: coffee
 *               price: 42.24
 *     responses:
 *       "201":
 *         description: Returns the created transaction.
 */
router.post("/", async (req, res) => {
    if (!req.body)
        throw new server.ServerError(server.serverErrorTypeInvalidRequestBody, "Request body cannot be empty.")

    return res.status(201).send(await domainTransactions.createTransaction({
        envelopeID: req.body.envelope_id,
        title: req.body.title,
        price: req.body.price,
    }))
})

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions or a specific transaction.
 *     produces:
 *       - application/json
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Transaction-ID
 *     responses:
 *       "200":
 *         description: Returns a list of all transactions or a specific transaction.
 *       "400":
 *         description: Transaction-ID isn't a valid UUID.
 *       "404":
 *         description: Transaction not found.
 */
router.get("/", async (req, res) => {
    if (req.query.id)
        return res.send(await domainTransactions.getTransactionByID(req.query.id))

    return res.send(await domainTransactions.getTransactions())
})

/**
 * @swagger
 * /transactions/{transaction_id}:
 *   put:
 *     summary: Update a transaction.
 *     produces:
 *       - application/json
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         description: Transaction-ID
 *         type: string
 *         required: true
 *         example: 123
 *     requestBody:
 *       description: Transaction fields.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               price:
 *                 type: float
 *             example:
 *               title: coffee
 *               price: 42.24
 *     responses:
 *       "200":
 *         description: Returns the updated transaction.
 *       "400":
 *         description: Transaction-ID isn't a valid UUID.
 *       "404":
 *         description: Transaction not found.
 */
router.put("/:transactionID", async (req, res) => {
    if (!req.body)
        throw new server.ServerError(server.serverErrorTypeInvalidRequestBody, "Request body cannot be empty.")

    return res.status(200).send(await domainTransactions.updateTransactionByID(req.params.transactionID, {
        title: req.body.title,
        price: req.body.price,
    }))
})

/**
 * @swagger
 * /transactions/{transaction_id}:
 *   delete:
 *     summary: Delete a transaction.
 *     produces:
 *       - application/json
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transaction_id
 *         description: Transaction-ID
 *         type: string
 *         required: true
 *         example: 123
 *     responses:
 *       "204":
 *         description: Transaction deleted.
 *       "400":
 *         description: Transaction-ID isn't a valid UUID.
 *       "404":
 *         description: Transaction not found.
 */
router.delete("/:transactionID", async (req, res) =>
    res.status(204).send(await domainTransactions.deleteTransaction(req.params.transactionID)))

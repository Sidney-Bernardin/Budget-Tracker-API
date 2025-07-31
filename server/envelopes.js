import express from "express"
import * as uuid from "uuid"

import * as server from "./server.js"
import * as domainEnvelopes from "../domain/envelopes.js"


export const router = express.Router()

/**
 * @swagger
 * /envelopes:
 *   post:
 *     summary: Create an envelope.
 *     produces:
 *       - application/json
 *     tags:
 *       - Envelopes
 *     requestBody:
 *       description: Envelope fields.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               money:
 *                 type: float
 *             example:
 *               title: savings
 *               money: 42.24
 *     responses:
 *       "201":
 *         description: Returns the created envelope.
 */
router.post("/", async (req, res) => {
    if (!req.body)
        throw new server.ServerError(server.serverErrorTypeInvalidRequestBody, "Request body cannot be empty.")

    return res.status(201).send(await domainEnvelopes.createEnvelope({
        title: req.body.title || "",
        money: req.body.money || 0,
    }))
})

/**
 * @swagger
 * /envelopes:
 *   get:
 *     summary: Get all envelopes or a specific envelope.
 *     produces:
 *       - application/json
 *     tags:
 *       - Envelopes
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: Envelope-ID
 *     responses:
 *       "200":
 *         description: Returns a list of all envelopes or a specific envelope.
 *       "400":
 *         description: Envelope-ID isn't a valid UUID.
 *       "404":
 *         description: Envelope not found.
 */
router.get("/", async (req, res) => {
    if (req.query.id)
        return res.send(await domainEnvelopes.getEnvelopeByID(req.query.id))

    return res.send(await domainEnvelopes.getEnvelopes())
})

/**
 * @swagger
 * /envelopes/{envelope_id}:
 *   put:
 *     summary: Update an envelope.
 *     produces:
 *       - application/json
 *     tags:
 *       - Envelopes
 *     parameters:
 *       - in: path
 *         name: envelope_id
 *         description: Envelope-ID
 *         type: string
 *         required: true
 *         example: 123
 *     requestBody:
 *       description: Envelope fields.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               money:
 *                 type: float
 *             example:
 *               title: savings
 *               money: 42.24
 *     responses:
 *       "200":
 *         description: Returns the updated envelope.
 *       "400":
 *         description: Envelope-ID isn't a valid UUID.
 *       "404":
 *         description: Envelope not found.
 */
router.put("/:envelopeID", async (req, res) => {
    if (!req.body)
        throw new server.ServerError(server.serverErrorTypeInvalidRequestBody, "Request body cannot be empty.")

    return res.status(200).send(await domainEnvelopes.updateEnvelopeByID(req.params.envelopeID, {
        title: req.body.title || "",
        money: req.body.money || 0,
    }))
})

/**
 * @swagger
 * /envelopes/{envelope_id}:
 *   delete:
 *     summary: Delete an envelope.
 *     produces:
 *       - application/json
 *     tags:
 *       - Envelopes
 *     parameters:
 *       - in: path
 *         name: envelope_id
 *         description: Envelope-ID
 *         type: string
 *         required: true
 *         example: 123
 *     responses:
 *       "204":
 *         description: Envelope deleted.
 *       "400":
 *         description: Envelope-ID isn't a valid UUID.
 *       "404":
 *         description: Envelope not found.
 */
router.delete("/:envelopeID", async (req, res) =>
    res.status(204).send(await domainEnvelopes.deleteEnvelope(req.params.envelopeID)))

import express from "express"
import * as uuid from "uuid"

import * as server from "./server.js"
import * as domainEnvelopes from "../domain/envelopes.js"


export const router = express.Router()


router.post("/", async (req, res) => {
    if (!req.body)
        throw new server.ServerError(server.serverErrorTypeInvalidRequestBody, "Request body cannot be empty.")

    return res.status(201).send(await domainEnvelopes.createEnvelope({
        title: req.body.title || "",
        money: req.body.money || 0,
    }))
})

router.get("/", async (req, res) => {
    if (req.query.id)
        return res.send(await domainEnvelopes.getEnvelopeByID(req.query.id))

    return res.send(await domainEnvelopes.getEnvelopes())
})

router.put("/:envelopeID", async (req, res) => {
    if (!req.body)
        throw new server.ServerError(server.serverErrorTypeInvalidRequestBody, "Request body cannot be empty.")

    return res.status(200).send(await domainEnvelopes.updateEnvelopeByID(req.params.envelopeID, {
        title: req.body.title || "",
        money: req.body.money || 0,
    }))
})

router.delete("/:envelopeID", async (req, res) =>
    res.status(204).send(await domainEnvelopes.deleteEnvelope(req.params.envelopeID)))

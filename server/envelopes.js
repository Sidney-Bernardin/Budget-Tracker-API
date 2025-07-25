import express from "express"

import * as db from "../database/database.js"
import * as dbEnvelopes from "../database/envelopes.js"


export const router = express.Router()


router.get("/", async (req, res) => {
    if (req.query.id)
        return res.send(await dbEnvelopes.selectEnvelopeByID())
    else
        return res.send(await dbEnvelopes.selectEnvelopes())
})

router.post("/", async (req, res) => {
    if (!req.body) return res.status(400).send("no request body")

    return res.status(201).send(await dbEnvelopes.insertEnvelope({
        title: req.body.title || "",
        money: req.body.money || 0,
    }))
})

router.put("/:envelopeID", async (req, res) => {
    if (!req.body) return res.status(400).send("no request body")

    return res.status(200).send(await dbEnvelopes.updateEnvelope(req.params.envelopeID, {
        title: req.body.title || "",
        money: req.body.money || 0,
    }))
})

router.delete("/:envelopeID", async (req, res) =>
    res.status(204).send(await dbEnvelopes.deleteEnvelope(req.params.envelopeID)))

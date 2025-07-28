import express from "express"
import * as uuid from "uuid"

import * as db from "../database/database.js"
import * as dbEnvelopes from "../database/envelopes.js"
import * as domain from "./domain.js"


export async function createEnvelope({ title, money }) {
    if (!title || title === "")
        throw new domain.DomainError(domain.domainErrorTypeEntityEnvelopeTitle, "Envelope title cannot be empty.")

    return await dbEnvelopes.insertEnvelope({
        title: title,
        money: money || 0,
    })
}

export async function getEnvelopes() {
    return await dbEnvelopes.selectEnvelopes()
}

export async function getEnvelopeByID(envelopeID) {
    if (!uuid.validate(envelopeID))
        throw new domain.DomainError(domain.domainErrorTypeUUIDInvalid, "Envelope-ID isn't a valid UUID.")

    try {
        return await dbEnvelopes.selectEnvelopeByID(envelopeID)
    } catch (err) {
        if (err.name === "DatabaseError" && err.type === db.databaseErrorTypeEntityNotFound)
            throw new domain.DomainError(domain.domainErrorTypeEnvelopeNotFound, "Envelope not found.")

        throw err
    }
}

export async function updateEnvelopeByID(envelopeID, { title, money }) {
    if (!uuid.validate(envelopeID))
        throw new domain.DomainError(domain.domainErrorTypeUUIDInvalid, "Envelope-ID isn't a valid UUID.")
    if (!title || title === "")
        throw new domain.DomainError(domain.domainErrorTypeEntityEnvelopeTitle, "Envelope title cannot be empty.")

    try {
        return await dbEnvelopes.updateEnvelopeByID(envelopeID, {
            title: title,
            money: money || 0,
        })
    } catch (err) {
        if (err.name === "DatabaseError" && err.type === db.databaseErrorTypeEntityNotFound)
            throw new domain.DomainError(domain.domainErrorTypeEnvelopeNotFound, "Envelope not found.")

        throw err
    }
}

export async function deleteEnvelope(envelopeID) {
    if (!uuid.validate(envelopeID))
        throw new domain.DomainError(domain.domainErrorTypeUUIDInvalid, "Envelope-ID isn't a valid UUID.")

    try {
        await dbEnvelopes.deleteEnvelopeByID(envelopeID)
    } catch (err) {
        if (err.name === "DatabaseError" && err.type === db.databaseErrorTypeEntityNotFound)
            throw new domain.DomainError(domain.domainErrorTypeEnvelopeNotFound, "Envelope not found.")

        throw err
    }
}

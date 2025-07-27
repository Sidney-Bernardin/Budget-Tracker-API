import express from "express"
import morgan from "morgan"

import * as envelopes from "./envelopes.js"
import * as transactions from "./transactions.js"
import * as domain from "../domain/domain.js"


const serverErrorTypeInternalServerError = "internal-server-error"
const serverErrorTypeDomainError = "domain-error"
const serverErrorTypeInvalidRequestBody = "invalid-request-body"

export class ServerError extends Error {
    constructor(type, message) {
        super(`${type}: ${message}`)
        this.name = "ServerError"
        this.type = type
        this.statusCode = ServerError.statusCodes[type] || 500
    }

    static statusCodes = {
        "entity.parse.failed": 400,
        [serverErrorTypeInternalServerError]: 500,
        [serverErrorTypeInvalidRequestBody]: 400,
        [domain.domainErrorTypeInvalidUUID]: 400,
        [domain.domainErrorTypeEntityEnvelopeTitle]: 400,
        [domain.domainErrorTypeEntityNotFound]: 404,
    }
}


export const app = express()

app.use(morgan("common"))
app.use(express.json())

app.use("/envelopes", envelopes.router)
app.use("/transactions", transactions.router)

app.use((err, req, res, next) => {

    let serverError
    switch (true) {
        case err.name === "ServerError":
            serverError = err
            break

        case err.type != undefined:
            serverError = new ServerError(err.type, err.message)
            break

        default:
            console.error(err.stack)
            serverError = new ServerError(serverErrorTypeInternalServerError, "Internal server error.")
            break
    }

    return res.status(serverError.statusCode).send(serverError.message)
})

import express from "express"
import morgan from "morgan"

import * as envelopes from "./envelopes.js"
import * as transactions from "./transactions.js"
import * as docs from "./docs.js"
import * as domain from "../domain/domain.js"


const serverErrorTypeInternalServerError = "internal-server-error"
const serverErrorTypeInvalidRequestBody = "invalid-request-body"

export class ServerError extends Error {
    constructor(type, message) {
        super(`${type}: ${message}`)
        this.name = "ServerError"
        this.type = type
        this.statusCode = ServerError.statusCodes[type]
    }

    static statusCodes = {
        [serverErrorTypeInternalServerError]: 500,
        [serverErrorTypeInvalidRequestBody]: 400,
        [domain.domainErrorTypeEnvelopeNotFound]: 404,
        [domain.domainErrorTypeTransactionNotFound]: 404,
        [domain.domainErrorTypeUUIDInvalid]: 400,
        [domain.domainErrorTypeEnvelopeTitleInvalid]: 400,
        [domain.domainErrorTypeTransactionTitleInvalid]: 400,
        [domain.domainErrorTypeTransactionPriceInvalid]: 400,
    }
}


export const app = express()

app.use(morgan("common"))
app.use(express.json())

app.use("/envelopes", envelopes.router)
app.use("/transactions", transactions.router)
app.use("/docs", docs.router)

app.use((err, req, res, next) => {

    let serverError
    switch (true) {
        case err.name === "ServerError":
            serverError = err
            break

        case err.name === "DomainError":
            serverError = new ServerError(err.type, err.message)
            break

        case err.type === "entity.parse.failed":
            serverError = new ServerError(serverErrorTypeInvalidRequestBody, err.message)
            break

        default:
            console.error(err.stack)
            serverError = new ServerError(serverErrorTypeInternalServerError, "Internal server error.")
            break
    }

    return res.status(serverError.statusCode).send({ "msg": serverError.message })
})

import express from "express"
import morgan from "morgan"

import * as envelopes from "./envelopes.js"
//import transactions from "./transactions.js"
import * as db from "../database/database.js"


const dbErrCodes = {
    [db.NotFoundError.name]: 404,
}


export const app = express()

app.use(morgan("common"))
app.use(express.json())

app.use("/envelopes", envelopes.router)
//app.use("/transactions", transactions.router)

app.use((err, req, res, next) => {
    const statusCode = dbErrCodes[err.name] || 500
    return res.status(statusCode).send(err.message)
})

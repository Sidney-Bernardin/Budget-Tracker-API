import express from "express"
import swaggerJSDoc from "swagger-jsdoc"
import * as swaggerUI from "swagger-ui-express"


const docs = swaggerJSDoc({
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Budget Tracker API",
            version: "1.0.0",
            description: "RESTful API for tracking you budget with envelopes and transactions.",
        }
    },
    apis: ["./server/envelopes.js", "./server/transactions.js"]
})


export const router = express.Router()

router.use("/", swaggerUI.serve, swaggerUI.setup(docs, { explorer: true }))

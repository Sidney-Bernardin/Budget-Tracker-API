export class DomainError extends Error {
    constructor(type, message) {
        super(`${type}: ${message}`)
        this.name = "DomainError"
        this.type = type
    }
}

export const domainErrorTypeEnvelopeNotFound = "envelope-not-found"
export const domainErrorTypeTransactionNotFound = "transaction-not-found"
export const domainErrorTypeUUIDInvalid = "uuid-invalid"
export const domainErrorTypeEnvelopeTitleInvalid = "envelope-title-invalid"
export const domainErrorTypeTransactionPriceInvalid = "transaction-price-invalid"

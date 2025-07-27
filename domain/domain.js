export class DomainError extends Error {
    constructor(type, message) {
        super(`${type}: ${message}`)
        this.name = "DomainError"
        this.type = type
    }
}

export const domainErrorTypeInvalidUUID = "invalid-uuid"
export const domainErrorTypeEntityEnvelopeTitle = "invalid-envelope-title"
export const domainErrorTypeEntityNotFound = "entity-not-found"

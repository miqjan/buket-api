export class AuthError extends Error {
    constructor( errors = null,message = 'AUTH_ERROR',status = 401 ) {
        super();
        this.message = message;
        this.errors = errors;
        this.status = status;
    }
}

export class BadRequest extends Error {

    constructor( errors = null,message = 'BAD_REQUEST', status = 400 ) {
        super();
        this.message = message;
        this.errors = errors;
        this.status = status;
    }
}


export class NotFound extends Error {

    constructor( errors = null,message = 'NOT_FOUND',status = 404 ) {
        super();
        this.message = message;
        this.errors = errors;
        this.status = status;
    }
}

export class ValidationError extends Error {

    constructor( errors = null,message = 'VALIDATION_ERROR',status = 400 ) {
        super();
        this.message = message;
        this.errors = errors;
        this.status = status;
    }
}

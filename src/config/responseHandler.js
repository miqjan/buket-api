const response = {
    //error start---------------------------------------------------------------------
    VALIDATION_ERROR: {
        status: 400,
        json: {
            status: 'Failed',
            message: 'Validation Error.',
            data: null,
            errors: null
        }
    },
    EMAIL_EXIST: {
        status: 409,
        json: {
            status: 'Error',
            message: 'User with this email alredy exist',
            data: null,
            errors: null
        }
    },
    MAST_SIGNIN: {
        status: 403,
        json: {
            status: 'Error',
            message: 'Error happened You have not permissions.',
            data: null,
            errors: null
        }
    },
    INVALID_PASSWORD: {
        status: 401,
        json: {
            status: 'Fail',
            message: `User with these credentials didn't exist.`,
            data: null,
            errors: null
        }
    },
    BLOC_USER: {
        status: 401,
        json: {
            status: 'Fail',
            message: `Administrators of platform blocked you.`,
            data: null,
            errors: null
        }
    },
    INVALID_EMAIL: {
        status: 401,
        json: {
            status: 'Fail',
            message: `User with these credentials didn't exist.`,
            data: null,
            errors: null
        }
    },
    NOT_FOUND: {
        status: 404,
        json: {
            status: 'Fail',
            message: 'Not found',
            data: null,
            errors: null
        }
    },  
    ERROR: {
        status: 400,
        json: {
            status: 'Error',
            message: 'Error happened while processing request.',
            data: null,
            errors: null
        }
    },
    //error  end---------------------------------------------------------------------
    //success start----------------------------------------------------------------
    SIGNED_IN: {
        status: 200,
        json: {
            status: 'Success',
            message: 'User successfully signed in.',
            data: null,
            errors: null
        }
    },
    SIGNED_UP: {
        status: 201,
        json: {
            status: 'Success',
            message: 'User successfully signed up.',
            data: null,
            errors: null
        }
    },
    SUCCESS: {
        status: 200,
        json: {
            status: 'Success',
            message: 'Request successfully completed.',
            data: null,
            errors: null
        }
    },
    //success end----------------------------------------------------------------
};



export default (res, name, data = null, errors = null) => {
    let status, json;
    let details = response[name];
    if (details) {
        status = details.status;
        json = Object.assign(details.json, {
            data: data,
            errors: errors
        });
    } else {
        status = 500;
        json = Object.assign({
            status: 'Failed',
            message: 'There is no response details.',
            data: null,
            errors: null
        }, {
            data: data,
            errors: errors
        });
    }

    return res.status(status).json(json);
};
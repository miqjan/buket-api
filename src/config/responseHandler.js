const response = {
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

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var config = {
    development: {
        dbConnectUrl: "mongodb://XXXXXXX:XXXXXXXX@ds044787.mlab.com:44787/buket",
        jwt: {
            secret: "jwt_secret",
        },
        app: {
            baseUrl: "http://localhost:3000/",
            port: 5000,
        },
    },
    production: {
        dbConnectUrl: "mongodb://XXXXXXXXXX:XXXXXXXXXX@ds044787.mlab.com:44787/buket",
        jwt: {
            secret: "XXXXXXXXXXXX",
        },
        app: {
            baseUrl: "",
            port: +process.env.PORT || 5000,
        },
    }
};
exports.default = function (config) {
    var env = arguments.length > 1 && arguments[1] !== undefined ? arguments[1].trim() : "development";

    var returnConfig = config.development;
    if (env === "production") {
        returnConfig = config.production;
    }
    return returnConfig;
}(config, process.env.NODE_ENV);
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import expressValidator  from 'express-validator';
import logger from 'morgan';

import enableRoutes from './api';
import config from '../config';
import { NotFound, ValidationError } from './config/errors';
import { validPassword } from './api/helpers/cusomValidators';
import * as _ from 'lodash';


class Application {
    constructor () {
        this.app = express();
        this.initApp();
    }
    initApp() {
        this.configApp();
        this.dbConfig();
        this.setParams();
        this.setRouter();
        this.setErrorHandler();
        this.set404Handler();
    }

    configApp() {
        this.app.use(bodyParser.json({limit: '50mb'}));
        this.app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
        this.app.use(expressValidator(
            {
                errorFormatter: (param, msg, value, location)=>{
                    return {param: param, message: msg, value: value, location: location};
                },
                customValidators: {
                    validPassword,
                }
            }
        ));
        this.app.use((req,res,next)=>{
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            next();
        });
        if(process.env.NODE_ENV !== 'production'){
            this.app.use(logger('dev'));
        }
        this.app.use(express.static(path.join(__dirname,'../','public')));
    }

    dbConfig() {
        
        mongoose.Promise = global.Promise;
        const connection = mongoose.connection;
        
        connection.on('error', function(error) {
            
            
            // eslint-disable-next-line no-console
            console.error('Error in MongoDb connection: ' + error);
          
            mongoose.disconnect();
        });
        connection.once('open', function() {
            // eslint-disable-next-line no-console
            console.log('connection open');
        });
        connection.on('connected', function() {
            // eslint-disable-next-line no-console
            console.log('connected!');
        });
        connection.on('reconnected', function () {
            // eslint-disable-next-line no-console
            console.log('reconnected');
        });
        connection.on('disconnected', function() {
            // eslint-disable-next-line no-console
            console.log('disconnected');
            // eslint-disable-next-line no-console
            console.log('dbURI is: '+ config.dbConnectUrl);
            mongoose.connect(config.dbConnectUrl ,{useMongoClient: true, autoReconnect: true});
        });

        this.mongoClient = mongoose.connect(config.dbConnectUrl ,{useMongoClient: true});
     
    }

    setParams() {
        this.app.set('port', process.env.PORT || 5000);//it not use port coming from config file
    }

    setRouter() {
        this.router = express.Router();
        this.app.use('/api',enableRoutes(this.router));
    }
    set404Handler(){
        this.app.use((req, res) => {
            const notFound = new NotFound('not found');
            res.status(notFound.status).json({status: 'Error', message: notFound.message, data: null, errors: notFound.errors});
        });
    }
    setErrorHandler() {
        this.app.use((error, req, res , next) => {
            // eslint-disable-next-line no-console
            if( _.isArray(error) ){
                error = new ValidationError(error);
            }
            res.status(error.status||500).json({status: 'Error', message: error.message, data: null, errors: error.errors });
        });
    }
}

export default () => new Application().app;

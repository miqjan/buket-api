import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import path from 'path';
import validator  from 'express-validator';

import enableRoutes from './api'
import responseHandler from './config/responseHandler';




const app = express();        
mongoose.Promise = global.Promise;
const conn = mongoose.connect('mongodb://root:root@ds044787.mlab.com:44787/buket');

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', ()=>console.log('connected'));

app.set('port', process.env.PORT || 5000);


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(validator());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.static(path.join(__dirname,'../','public')));

app.use('/api',enableRoutes(express.Router()));


app.use(function(req, res, next){
    responseHandler(res,"NOT_FOUND");
});
app.use(function(error, req, res, next){
    if(process.env.NODE_ENV !== "production"){
        console.log(error);
    }
    if (error instanceof Array){  
        responseHandler(res,"VALIDATION_ERROR",null,error);
    } 
    responseHandler(res,error.message,null,error);
});

// let listener = app.listen(app.get('port'),'192.168.0.56',function(){
//     console.log('Example app listening at http://%s:%s', listener.address().address, listener.address().port);
// });
let listener1 = app.listen(app.get('port'),function(){
    console.log('api listening at http://%s:%s', listener1.address().address, listener1.address().port); 
});

require('dotenv').config()
import express from 'express';
import {scheduler} from './controller/schedulerController'
import {msdb} from './config/database'

const app = express();
const PORT = process.env.PORT|| 2000;

scheduler()


app.listen(PORT, () => {

    console.log(`🚀 Magic happens at port number ${PORT}`);

});




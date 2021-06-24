
require('dotenv').config()
import express from 'express';
import {scheduler, loginAuth, setSheduleWithDateRange} from './controller/schedulerController'
import {msdb} from './config/database'
import i18n from 'i18n-2'
import {localize,checkAuthorizaion,checkModule} from './middleware'

const app = express();
const PORT = process.env.PORT|| 2000;

app.use(express.json({limit:'1024mb',strict:false}))

// language config

i18n.expressBind(app, {locales: [ 'en' ] })

app.use(localize)

scheduler()

app.post('/api/auth/login',checkModule,loginAuth)

app.post('/api/setSheduleWithDateRange',checkAuthorizaion,setSheduleWithDateRange)



app.listen(PORT, () => {

    console.log(`🚀 Magic happens at port number ${PORT}`);

});




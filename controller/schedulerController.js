require('dotenv').config()
import Corn from 'node-cron'
import sequelize from '../config/database'
import {verifyPassword,tokenGenerate} from '../middleware'
import  {OK, INTERNAL_SERVER_ERROR,BAD_REQUEST,NOT_FOUND,UNAUTHORIZED} from '../helpers/responseHelper'


const usernameAuth = process.env.apiusername
const passwordAuth = process.env.apipassword

Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

 //2020-05-23T07:11:02.811Z to 2020-05-13
const CurrentDate = (datetime=new Date())=>{return datetime.toISOString().split('T')[0]}

const DateDiffrenceBetweenToDate = (startDate, endDate)=>{
    var t1 = new Date(endDate);
    var t2 = new Date(startDate);
    var dif = t1.getTime() - t2.getTime();
    var Date_from_T1_to_T2 = dif / (1000*60*60*24);
   return Math.floor(Date_from_T1_to_T2)
}

const scheduler = async(req,res)=>{

    try{

        //will run every day at 12:00 AM
        Corn.schedule('0 0 0 * * *', () =>  {
        console.log('--------------------- ', new Date())
        sequelize.query(`EXEC SW_JOB_PROC_GENERATE_DAILY_WALLET_STATUS @EodDate = '${CurrentDate()}'`)
                .then(v=>console.log(v))
                .catch(e=>console.log(e))
      },{scheduled: true})
       
    }catch(e){

        console.log(e)
  }

}


const loginAuth = async (req,res) => {

    console.log(req.body)
    let {username=null, password=null} = req.body
    
    let ctime = Date.now()

    let is_veryfied = await verifyPassword(password, passwordAuth)

    console.log(is_veryfied)

    console.log(usernameAuth)
     
    if(username != usernameAuth || !is_veryfied){

        return res.status(200).send({
            "statuscode" : 400,
            "msg" : "Login Fail",
            "createTime" : ctime
          });

    }

    const token = await tokenGenerate({username,ctime},{ expiresIn: '1h' })

    return res.status(200).send({
        "statuscode" : 200,
        "msg" : "Login Success",
        "body":{
             token,     
        },
        "createTime" : ctime
      })
}


const setSheduleWithDateRange = async(req,res) => {

    let {startDate, endDate} = req.body, i = 0

    let datediff = DateDiffrenceBetweenToDate(startDate, endDate)

    console.log('datediff ',datediff)

    datediff++

    while(datediff){

        const addingdate = (new Date(startDate)).addDays(i)

        console.log('setSheduleWithDateRange--------------------- ', addingdate)

        await sequelize.query(`EXEC SW_JOB_PROC_GENERATE_DAILY_WALLET_STATUS @EodDate = '${addingdate}'`)
        .then(v=>console.log(v))
        .catch(e=>console.log(e))
         
        datediff--
        i++
    }

    return res.status(200).send(OK( null, null, req))

}


module.exports = {scheduler,loginAuth,setSheduleWithDateRange, setSheduleWithDateRange};
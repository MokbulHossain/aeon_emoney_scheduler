
import Corn from 'node-cron'
import sequelize from '../config/database'

 //2020-05-23T07:11:02.811Z to 2020-05-13
const CurrentDate = (datetime=new Date())=>{return datetime.toISOString().split('T')[0]}

const scheduler = async(req,res)=>{

    try{

        //will run every day at 12:00 AM
        Corn.schedule('0 0 0 * * *', () =>  {
        console.log('---------------------');
        sequelize.query(`EXEC SW_JOB_PROC_GENERATE_DAILY_WALLET_STATUS @EodDate = '${CurrentDate()}'`)
                .then(v=>console.log(v))
                .catch(e=>console.log(e))
      },{scheduled: true,timezone:process.env.time_zone||"Asia/Dhaka"});
       
    }catch(e){

        console.log(e)
 }

}







module.exports = {scheduler};
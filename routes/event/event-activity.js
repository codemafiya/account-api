var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/createEvent', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   console.log(input)
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".event (event_cd,event_desc,event_type_cd,event_cat_cd) values ("+SqlString.escape(input.event_cd)+","+SqlString.escape(input.event_desc)+","+SqlString.escape(input.event_type_cd)+","+SqlString.escape(input.event_cat_cd)+")";
    console.log(sqlJoining);
    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Event added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllEvent', (req, res) => {
    let objectToSend = {}

   

    
    let db="account";

    let sql_fetchCurr = "Select * from " + db + ".event"
    
    mysqlPool.query(sql_fetchCurr, function (error, results) {
        if (error) {
            console.log("Error-->routes-->projectMetadata-->metadata-->getcodevalue--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false
            objectToSend["data"] = results
            res.send(objectToSend);
        }
    })
})
router.put('/updateEvent',(req,res)=>{
    let objectToSend={}

    let obj=req.body
    var db = propObj.db;

   

    let sql="update "+db+".event set event_cd="+SqlString.escape(obj.event_cd)+",event_type_cd="+SqlString.escape(obj.event_type_cd)
            +",event_desc="+SqlString.escape(obj.event_desc)+",event_cat_cd="+SqlString.escape(obj.event_cat_cd)+" where id="+SqlString.escape(obj.id);

    
    mysqlPool.query(sql,function(error,results){
        if(error){
            console.log("Error-->routes-->hr-->party-->bankAccountInfo-->updateBankAccount", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Event updated successfully" 
            res.send(objectToSend);
        }
    })
})

router.delete('/deleteEvent:dtls',(req,res)=>{
    let objectToSend={}

    let obj=JSON.parse(req.params.dtls)

    
    let id=obj["id"]
    var db = propObj.db;

    let sql="delete from "+db+".event where id="+id

    mysqlPool.query(sql,function(error,results){
        if(error){
            console.log("Error-->routes-->hr-->party-->bankAccountInfo-->deleteBankAccount", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Event deleted successfully" 
            res.send(objectToSend);
        }
    })

})

module.exports = router;
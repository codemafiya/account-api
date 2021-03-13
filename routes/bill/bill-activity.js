var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');
var moment = require('moment');

var SqlString = require('sqlstring');



router.post('/createBill', (req, res) => {
    let objectToSend = {}
    let input = req.body;
    var dt = moment().format('YYYY-MM-DD');
    //console.log(dt);
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".bill (bill_desc,bill_dt,party_id,data,status,bill_amt) values ("+SqlString.escape(input.bill_desc)+","+SqlString.escape(dt)+","+SqlString.escape(input.party_id)+","+SqlString.escape(input.data)+",'CREATED',"+SqlString.escape(input.bill_amt)+")";
    //console.log(sqlJoining);
    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            console.log(results);
            objectToSend["error"] = false;
            objectToSend["id"] = results['insertId'];
            objectToSend["data"] = "Bill created Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllBill', (req, res) => {
    let objectToSend = {}

   

    
    let db="account";

    let sql_fetchCurr = "Select * from " + db + ".bill"
    
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
router.put('/updateBill',(req,res)=>{
    let objectToSend={}

    let obj=req.body
    var db = propObj.db;

   

    let sql="update "+db+".bill set bill_desc="+SqlString.escape(obj.bill_desc)+",bill_dt="+SqlString.escape(obj.bill_dt)
            +",party_id="+SqlString.escape(obj.party_id)+",bill_amt="+SqlString.escape(obj.bill_amt)+",data="+SqlString.escape(obj.data)+" where id="+SqlString.escape(obj.id);

    
    mysqlPool.query(sql,function(error,results){
        if(error){
            console.log("Error-->routes-->hr-->party-->bankAccountInfo-->updateBankAccount", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Bill updated successfully" 
            res.send(objectToSend);
        }
    })
})

router.delete('/deleteBill:dtls',(req,res)=>{
    let objectToSend={}

    let obj=JSON.parse(req.params.dtls)

    
    let id=obj["id"]
    var db = propObj.db;

    let sql="delete from "+db+".bill where id="+id
    let sql1 = "delete from "+db+".jrnl where event_type='BILL' and event_id="+id
    mysqlPool.query(sql+";"+sql1,function(error,results){
        if(error){
            console.log("Error-->routes-->hr-->party-->bankAccountInfo-->deleteBankAccount", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Bill deleted successfully" 
            res.send(objectToSend);
        }
    })

})

module.exports = router;
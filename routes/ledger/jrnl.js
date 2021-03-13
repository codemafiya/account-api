var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');
var moment = require('moment');

var SqlString = require('sqlstring');

router.get('/getAccounts', (req, res) => {
    let objectToSend = {}

   

    
    let db="account";

    let sql_fetchCurr = "Select * from " + db + ".accounts"
    
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
router.get('/getTbl', (req, res) => {
    let objectToSend = {}

   

    
    let db="account";

    let sql_fetchCurr = "Select lvl1_cd,lvl1_desc,lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,lvl4_cd,lvl4_desc,acct_num,db_cr_ind,sum(txn_amt) as balance from " + db + ".jrnl j join "+db+".accounts a on j.acct_num=a.lvl4_cd group by lvl1_cd,lvl1_desc,lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,lvl4_cd,lvl4_desc,acct_num,db_cr_ind"
    
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
router.post('/createJrnl', (req, res) => {
    let objectToSend = {}
    let input = req.body;
    var dt = moment().format('YYYY-MM-DD');
    //console.log(dt);
    var db = propObj.db;
    var arr = input.jrnl;
    var sqlJoining  = "insert into "+db+".jrnl (jrnl_desc,jrnl_type,ledger_cat,acct_dt,ppd,jrnl_line_id,jrnl_line_desc,db_cr_ind,txn_amt,event_type,party_id,acct_num,event_id) values ";
    for(var i=0;i<arr.length;i++){
        sqlJoining+=  "("+SqlString.escape(arr[i]['jrnl_desc'])+","+SqlString.escape(arr[i]['jrnl_type'])+","+SqlString.escape(arr[i]['ledger_cat'])+","+SqlString.escape(dt)+","+SqlString.escape(dt)+","+SqlString.escape(arr[i]['jrnl_line_id'])+","+SqlString.escape(arr[i]['jrnl_line_desc'])+","+SqlString.escape(arr[i]['db_cr_ind'])+","+SqlString.escape(arr[i]['txn_amt'])+","+SqlString.escape(arr[i]['event_type'])+","+SqlString.escape(arr[i]['party_id'])+","+SqlString.escape(arr[i]['acct_num'])+","+SqlString.escape(arr[i]['event_id'])+")";
        if(i!=arr.length-1){
            sqlJoining+=",";
        }
    }
    console.log(sqlJoining);
    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            console.log(results);
            objectToSend["error"] = false;
            
            objectToSend["data"] = "Jrnl created Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getTrialBalance', (req, res) => {
    let objectToSend = {}

   

    
    let db="account";

    let sql_fetchCurr = "Select acct_num,db_cr_ind,sum(txn_amt) as balance from " + db + ".jrnl group by acct_num,db_cr_ind"
    
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

    mysqlPool.query(sql,function(error,results){
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
var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/createAccount', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   console.log(input)
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".accounts (lvl1_cd,lvl1_desc,lvl2_cd,lvl2_desc,lvl3_cd,lvl3_desc,lvl4_cd,lvl4_desc) values ("+SqlString.escape(input.lvl1_cd)+","+SqlString.escape(input.lvl1_desc)+","+SqlString.escape(input.lvl2_cd)+","+SqlString.escape(input.lvl2_desc)+","+SqlString.escape(input.lvl3_cd)+","+SqlString.escape(input.lvl3_desc)+","+SqlString.escape(input.lvl4_cd)+","+SqlString.escape(input.lvl4_desc)+")";
    console.log(sqlJoining);
    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Account added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllAccount', (req, res) => {
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
router.put('/updateAccount',(req,res)=>{
    let objectToSend={}

    let obj=req.body
    var db = propObj.db;

   

    let sql="update "+db+".accounts set lvl1_cd="+SqlString.escape(obj.lvl1_cd)+",lvl1_desc="+SqlString.escape(obj.lvl1_desc)+", "
    +"lvl2_cd="+SqlString.escape(obj.lvl2_cd)+",lvl2_desc="+SqlString.escape(obj.lvl2_desc)+", "
    +"lvl3_cd="+SqlString.escape(obj.lvl3_cd)+",lvl3_desc="+SqlString.escape(obj.lvl3_desc)+", "
    +"lvl4_cd="+SqlString.escape(obj.lvl4_cd)+",lvl4_desc="+SqlString.escape(obj.lvl4_desc)

            +" where id="+SqlString.escape(obj.id);

    console.log(sql);
    mysqlPool.query(sql,function(error,results){
        if(error){
            console.log("Error-->routes-->hr-->party-->bankAccountInfo-->updateBankAccount", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Account updated successfully" 
            res.send(objectToSend);
        }
    })
})

router.delete('/deleteAccount:dtls',(req,res)=>{
    let objectToSend={}

    let obj=JSON.parse(req.params.dtls)

    
    let id=obj["id"]
    var db = propObj.db;

    let sql="delete from "+db+".accounts where id="+id

    mysqlPool.query(sql,function(error,results){
        if(error){
            console.log("Error-->routes-->hr-->party-->bankAccountInfo-->deleteBankAccount", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Account deleted successfully" 
            res.send(objectToSend);
        }
    })

})

module.exports = router;
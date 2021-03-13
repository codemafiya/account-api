var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');

var SqlString = require('sqlstring');



router.post('/createParty', (req, res) => {
    let objectToSend = {}
    let input = req.body;
   //console.log(input)
    var db = propObj.db;
    var sqlJoining  = "insert into "+db+".party (party_legal_name,party_email,party_phone_no,party_gstin_no,per_addr) values ("+SqlString.escape(input.party_legal_name)+","+SqlString.escape(input.party_email)+","+SqlString.escape(input.party_phone_no)+","+SqlString.escape(input.party_gstin_no)+","+SqlString.escape(input.per_addr)+")";
    //console.log(sqlJoining);
    mysqlPool.query(sqlJoining, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Party added Successfully"
            res.send(objectToSend)

        } 
    })
})
router.get('/getAllParty', (req, res) => {
    let objectToSend = {}

   

    
    let db="account";

    let sql_fetchCurr = "Select * from " + db + ".party"
    
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
router.put('/updateParty',(req,res)=>{
    let objectToSend={}

    let obj=req.body
    var db = propObj.db;

   

    let sql="update "+db+".party set party_legal_name="+SqlString.escape(obj.party_legal_name)+",party_email="+SqlString.escape(obj.party_email)+",party_phone_no="+SqlString.escape(obj.party_phone_no)+",per_addr="+SqlString.escape(obj.per_addr)+",party_gstin_no="+SqlString.escape(obj.party_gstin_no)
            +" where id="+SqlString.escape(obj.id);

    
    mysqlPool.query(sql,function(error,results){
        if(error){
            console.log("Error-->routes-->hr-->party-->bankAccountInfo-->updateBankAccount", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Party updated successfully" 
            res.send(objectToSend);
        }
    })
})

router.delete('/deleteParty:dtls',(req,res)=>{
    let objectToSend={}

    let obj=JSON.parse(req.params.dtls)

    
    let id=obj["id"]
    var db = propObj.db;

    let sql="delete from "+db+".party where id="+id

    mysqlPool.query(sql,function(error,results){
        if(error){
            console.log("Error-->routes-->hr-->party-->bankAccountInfo-->deleteBankAccount", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        }else{
            objectToSend["error"] = false
            objectToSend["data"] = "Party deleted successfully" 
            res.send(objectToSend);
        }
    })

})

module.exports = router;
var express = require('express');
var router = express.Router();
var propObj = require('../../config_con.js')
var mysqlPool = require('../../connections/mysqlConnection.js');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
var SqlString = require('sqlstring');

function decryptPassword(text) {
    let key = Buffer.from(propObj.encryptionKey, 'hex')
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString().trim();
}


router.post('/login', (req, res) => {
    let objectToSend = {}
    let input = req.body
    let email = input["email"]
    let passwd = input["password"]

    let sql_getUserInfo = "select * from account_sys_data.users where email="+email+" and password="+passwd;


    mysqlPool.query(sql_getUserInfo, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else if (results.length == 0) {
            objectToSend["error"] = true;
            objectToSend["data"] = "This email is not registered."
            res.send(objectToSend)

        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = "Login Successful"
            res.send(objectToSend)
        }
    })
})
router.post('/phoneLogin', (req, res) => {
    let objectToSend = {}
    let input = req.body
    let phone_no = input["phone_no"]

    let sql_getUserInfo = "select * from account_sys_data.users where phone_no='"+phone_no+"'";


    mysqlPool.query(sql_getUserInfo, function (error, results) {
        if (error) {
            console.log("Error-->routes-->portal-->login-->login--", error)
            objectToSend["error"] = true
            objectToSend["data"] = "Some error occured at server side. Please try again later. If problem persists, contact support."
            res.send(objectToSend);
        } else if (results.length == 0) {
            objectToSend["error"] = true;
            objectToSend["data"] = "This Phone No is not registered."
            res.send(objectToSend)

        } else {
            objectToSend["error"] = false;
            objectToSend["data"] = results[0];
            res.send(objectToSend)
        }
    })
})


router.post('/forgotPassword', function (req, res) {
    let userInfo = req.body;
    let objectToSend = {};

    mysqlPool.query("select email_id,password from " + propObj.svayamSystemDbName + ".user_info where email='" + userInfo.email + "'", function (error, results) {
        let password;
        let recieverEmail;


        if (error) {
            console.log("Error routes-->portal-->login-->sendUserPassword", error);
            objectToSend["error"] = true;
            objectToSend["data"] = "Can't process yor request right now.Please try again later"
            res.end(JSON.stringify(objectToSend))
        } else if (results.length == 0) {
            objectToSend["error"] = true;
            objectToSend["data"] = "No account with this email is present"
            res.end(JSON.stringify(objectToSend))


        } else {



            password = decryptPassword(JSON.parse(results[0]["password"]))
            recieverEmail = results[0]["email"]

            let Transport = mailer.createTransport({
                service: "Gmail",
                auth: {
                    user: senderEmail,
                    pass: propObj.senderPass
                }
            });
            let options1 = {
                viewEngine: {
                    extname: '.hbs', // handlebars extension
                    layoutsDir: 'View/', // location of handlebars templates
                    defaultLayout: 'forgetpass', // name of main template
                    partialsDir: 'View/', // location of your subtemplates aka. header, footer etc
                },
                viewPath: 'View/',
                extName: '.hbs'
            };
            Transport.use('compile', hbs(options1));


            let smail = {
                from: senderEmail,
                to: recieverEmail,
                subject: "Sensitive Information",
                attachments: [{
                    filename: 'img.jpg',
                    path: 'View/img.jpg',
                    cid: 'unique@cid'
                }],
                template: "forgetpass",
                context: {
                    passw: password

                }
            }

            Transport.sendMail(smail, function (error2, info) {
                if (error2) {

                    console.log("Error routes-->portal-->login-->sendUserPassword", error2);
                    objectToSend["error"] = true;
                    objectToSend["data"] = "Can't process yor request right now.Please try again later"
                    res.end(JSON.stringify(objectToSend))
                } else {

                    objectToSend["error"] = false;
                    objectToSend["data"] = "Password sent to your registered email"
                    res.end(JSON.stringify(objectToSend))


                }
                smtpTransport.close();


            });

        }

    });


});
module.exports = router;
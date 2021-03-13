var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');






//start body-parser configuration
app.use(bodyParser.json({ limit: '50mb' }));
// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


app.use(cors());
app.options('*', cors());
app.use(function (req, res, next) {
    //set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var event = require('./routes/event/event-activity.js');
app.use('/event',event);
var product = require('./routes/metadata/product.js');
app.use('/product',product);
var account = require('./routes/metadata/account.js');
app.use('/account',account);
var bill = require('./routes/bill/bill-activity.js');
app.use('/bill',bill);
var bp = require('./routes/bill/bp.js');
app.use('/bp',bp);
var codevalue = require('./routes/metadata/codevalue.js');
app.use('/codevalue',codevalue);
var party = require('./routes/metadata/party.js');
app.use('/party',party);
var jrnl = require('./routes/ledger/jrnl.js');
app.use('/jrnl',jrnl);
var login = require('./routes/portal/login.js');
app.use('/login',login);



//Server listen method
var server = app.listen(3001, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Accounts listening at http://%s:%s", host, port)
});




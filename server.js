var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors');
var sassMiddleware = require('node-sass-middleware');
var morgan = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var request = require('request');
var serveStatic = require('serve-static');

var app = express();
var api = express();

var port = 3000;
var api_port = 3001;

//////////////////////////////////////////////////////////////////

app.use(sassMiddleware({
    src: __dirname + '/public/',
    dest: __dirname + '/public/css',
    debug: true,
    prefix: '/css',
    outputStyle: 'expanded'
}));

app.set('port', process.env.PORT || port);
app.use(morgan('dev')); // log every request to the console
app.use(express.static(__dirname + "/public"));
    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
api.use(cors());


api.set('port', api_port);
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

//////////////////////////////////////////////////////////////////
api.get('/', function(req, res, next) {
	res.send("api works!");
});

app.use(serveStatic('json'));

app.get("/f2frequest", function(req, res) {
    var url = 'http://www.food2fork.com/api/search?key=529cd164050b80734aff7a59a2f7a0a3';
    
    if (req.query && req.query.data) {
        console.log(req.query.data)
        url = url + "&q=" + req.query.data;
    }

    console.log(url);

    request.get(url, function(error, response, body){
        res.type('json');
        res.send(body);
    });
});

/*
app.get("/dict", function(req, res) {
    request.get('/json/dict.json', function(error, response, body) {
        res.type('json');
        console.log("dict : " + body);
        res.send(body);
    })
})
*/
app.use('/*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});


//////////////////////////////////////////////////////////////////
app.listen(port, function() {
    console.log('listening on port: '+ port);
});

api.listen(api_port, function(){
	console.log('api on port: '+ api_port);
});

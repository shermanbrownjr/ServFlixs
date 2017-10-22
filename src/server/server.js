
var express = require('express');
var ip = require('ip');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var colors = require('colors');
var Bootstrap = require('./bootstrap');
var session = require('express-session');

var port = process.env.PORT || 5000;

var app = express(); 
app.use(cookieParser());
app.use(session({ 
    secret: "fd34s@!@dfa453f3DF#$D&W",
    resave: false,
    saveUninitialized: true
}));

app.locals.moment = require('moment'); 

app.set('views', 'dist/app/views');
app.set('view engine', 'pug');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist/app/lib'));

var router = require('./router')({ title: 'Flixs', port: port });
app.use('/', router);

app.listen(port,'0.0.0.0', () => {
    var bootstrap = Bootstrap();

    bootstrap.firstRun();
    console.log(colors.green(`Now browse to ${ip.address()}:${port}`));
});

module.exports = app;
var express = require('express');
var bootFile = require('./boot');
var colors = require('colors');
var Smb = require('smb2');
var Bootstrap = require('./bootstrap');
var movieDrive = bootFile.drives[0];
var movieRouter = require('./movieRouter')({ title: 'Flixs' });

const smbClient = new Smb({
    share: movieDrive.videoDriveAddress,
    domain: '',
    username: movieDrive.videoDriveUserName,
    password: movieDrive.videoDrivePassword
});

 
var app = express(); 
var port = process.env.PORT || 5000;
 
app.locals.moment = require('moment');
app.locals._ = require('lodash'); 
app.set('views', 'dist/app/views');
app.set('view engine', 'pug');
app.use(express.static('dist/app/lib'));
app.use('/', movieRouter);


app.listen(port, () => {
    var bootstrap = Bootstrap({
        smbClient: smbClient,
        dir: movieDrive.videoDirectory
    });

    bootstrap.firstRun();
    console.log(colors.green(`Now browse to localhost:${port}`));
});

module.exports = app;

// for d in */ ; do
// fixed=${d/ \///}
// mv $d $fixed
// echo $fixed
// done
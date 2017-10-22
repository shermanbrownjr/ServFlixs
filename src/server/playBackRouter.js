var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    playBackRouter = express.Router(),
    ip = require('ip');

var router = (args) => {

   
    playBackRouter.route('/:title/:file/cast/start')  
        .get((req, res) => {
            if (typeof req.session.cast === 'undefined') {
                var file = `http://${ip.address()}:${args.port}/playback/${req.params.title}/stream/${req.params.file}`;

                req.session.cast = {   
                    media: file,
                    details: req.session.lastBrowsedMovie
                };

                // var cast = require('./chromecast')({media: req.session.cast.media});
                // cast.start();

                res.render('cast',{title: args.title, movie : req.session.cast.details});

                
            }
        });

    playBackRouter.route('/cast/stop')
        .get((req, res) => {
            var cast = require('./chromecast')({media: req.session.cast.media});

            // cast.stop();

        });

    playBackRouter.route('/cast/pause')
        .get((req, res) => { 
            var cast = require('./chromecast')({media: req.session.cast.media});
            // cast.pause();

        });

    playBackRouter.route('/cast/play')
        .get((req, res) => {
            var cast = require('./chromecast')({media: req.session.cast.media});
            // cast.play();
        });

    playBackRouter.route('/cast/fastForward')
        .get((req, res) => {
            var cast = require('./chromecast')({media: req.session.cast.media});
            // cast.fastForward();

        });

    playBackRouter.route('/cast/rewind')
        .get((req, res) => {
            var cast = require('./chromecast')({media: req.session.cast.media});
            // cast.rewind();
        });

    playBackRouter.route('/cast/seek/:seconds')
        .get((req, res) => {
            var cast = require('./chromecast')({media: req.session.cast.media});
            console.log(seconds);
            // cast.seek(Number(seconds));

        });

    playBackRouter.route('/cast/status')
        .get((req, res) => {
            var cast = require('./chromecast')({media: req.session.cast.media});
            // cast.status();
        });

    playBackRouter.route('/:title/stream/:video')
        .get((req, res) => {
            var file = getFilePath(req.params.title);

            var stat = fs.statSync(file);
            var total = stat.size;

            res.header('Content-Length', total);
            res.header("Content-Type", `video/${path.extname(file).replace('.', '')}`);
            res.sendFile(file);
        });

    function getFilePath(title) {
        var dir = path.resolve('/Volumes/Videos/Movies/', title);

        const endsWith = (str, suffix) => str.indexOf(suffix, str.length - suffix.length) !== -1;
        return path.resolve(dir, fs.readdirSync(dir).filter(file => endsWith(file, ".mp4") || endsWith(file, ".avi"))[0]);
    }

    // playBackRouter.route('/:title/stream')
    //     .get((req, res) => {

    //         var videoFileName = req.params.title;

    //         var streamPath = path.resolve('__dirname', videoFileName);

    //         var stat = fs.statSync(streamPath);
    //         var total = stat.size;
    //         var file;
    //         var contentType = "video/mp4";

    //         if (endsWith(videoFileName, ".ogg")) {
    //             contentType = "video/ogg";
    //         }

    //         if (endsWith(videoFileName, ".webm")) {
    //             contentType = "video/webm";
    //         }

    //         if (req.headers.range) {

    //             var range = req.headers.range;
    //             var parts = range.replace(/bytes=/, "").split("-");
    //             var partialstart = parts[0];
    //             var partialend = parts[1];

    //             var start = parseInt(partialstart, 10);
    //             var end = partialend ? parseInt(partialend, 10) : total - 1;
    //             var chunksize = (end - start) + 1;

    //             console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

    //             file = fs.createReadStream(streamPath, {
    //                 start: start,
    //                 end: end
    //             });

    //             res.writeHead(206, {
    //                 'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
    //                 'Accept-Ranges': 'bytes',
    //                 'Content-Length': chunksize,
    //                 'Content-Type': contentType
    //             });

    //             res.openedFile = file;
    //             file.pipe(res);

    //         } else {
    //             console.log('ALL: ' + total);
    //             file = fs.createReadStream(streamPath);
    //             res.writeHead(200, {
    //                 'Content-Length': total,
    //                 'Content-Type': contentType
    //             });
    //             res.openedFile = file;
    //             file.pipe(res);
    //         }

    //         res.on('close', function () {
    //             console.log('response closed');
    //             if (res.openedFile) {
    //                 res.openedFile.unpipe(this);
    //                 if (this.openedFile.fd) {
    //                     fs.close(this.openedFile.fd);
    //                 }
    //             }
    //         });

    //     });

    return playBackRouter;

};

module.exports = router;

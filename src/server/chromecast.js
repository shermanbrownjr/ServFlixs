const player = require('chromecast-player')();
var colors = require('colors');


var chromecast = (args) => {

    var media = args.media;

    var start = () => {
        player.launch(media, (err, p) => {
            p.once('playing', () => {
              console.log('playback has started.');
            });
          });
    }

    var stop = () =>{
        player.attach((err, p) => {
            p.stop();
          });
    }

    var pause = () => {
        player.attach((err, p) => {
            p.pause();
          });
    }

    var play = () =>{
        player.attach((err, p) => {
            p.play();
          });
    }

    var fastForward = () =>{ 
        player.attach((err, p) => {
            var seconds = Math.max(0, (p.getPosition() / 1000) + 15);
            p.seek(seconds);
          });
    } 
 
    var rewind = () =>{
        player.attach((err, p) => {
            var seconds = Math.max(0, (p.getPosition() / 1000) - 15);
            p.seek(seconds);
          });
    }

    var seek = (seconds) => {
        player.attach((err, p) => {
            p.seek(seconds);
          });
    }

    var status = () => {
        player.attach((err, p) => {
           console.log(p.getStatus());
          });
    }
    
    return {
        start: start,
        stop: stop,
        pause: pause,
        play: play,
        fastForward: fastForward,
        rewind: rewind,
        seek: seek,
        status: status
    }
}

module.exports = chromecast;







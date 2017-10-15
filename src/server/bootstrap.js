var _ = require('lodash');
var colors = require('colors');
var Repo = require('./repo');
var Imdb = require('./imdb');
var backoff = require('backoff');

var bootstrap = (args) => {
    var smbClient = args.smbClient;
    var repo = Repo();
    var imdb = Imdb();
    var dir = args.dir;

    var firstRun = function () {
        try {
            repo.movieReferenceCount().then((count) => {
                if (count <= 0) {
                    console.log(colors.bgWhite("Bootstrap: populating db"));
                    smbClient.readdir(args.dir, (err, dirs) => {

                        imdb.genres().then((data) => {
                            var genres = data.response.genres;

                            repo.createGenres(data.response).then(() => {

                                dirs.forEach(function (element) {
                                    var splitName = element.split(" ");
                                    var year = Number(splitName[(splitName.length - 1)]);
                                    var title = element.replace(year.toString(), '').trim();

                                    if (!isNaN(year)) {
                                        var call = backoff.call(getMovies, { title: title, year: year }, (err, data) => {
                                            if (data.error) {
                                                console.log(colors.red('Error: ' + data.error.message));
                                            } else {
                                                console.log(`${element} found`);

                                                var genresMapping = [];

                                                data.response.results[0].genre_ids.forEach((element) => {
                                                    genresMapping = _.unionBy(genresMapping, _.filter(genres, (o) => { return o.id == element }), 'name');
                                                });

                                                data.response.results[0].genre_ids = genresMapping;

                                                var movie = { directory: element, details: data.response.results[0] };

                                                repo.createMovie({ movie: movie }).then((data) => {
                                                    console.log(`${element} added`);
                                                    repo.createMovieReference({
                                                        reference: {
                                                            title: element,
                                                            onboarded: true
                                                        }
                                                    }).then((data) => {
                                                        console.log(`${element} refereced`);
                                                    });
                                                });
                                            }
                                        });

                                        call.retryIf(function (err) {
                                            if (err == '429') {
                                                console.log(colors.red(`Received ${err} backing off and then retrying. Attempt: ${call.getNumRetries() + 1} of 10`));
                                                return true;
                                            }

                                            return false;
                                        });
 
                                        call.setStrategy(new backoff.ExponentialStrategy());
                                        call.failAfter(10);
                                        call.start();
                                    }

                                });

                            });
                        });
                    });
                }
            });
        }
        catch (err) {
            console.log(colors.bgRed(err));
        }
    }

    function getMovies(args, callback) {
        imdb.findMovie({ title: args.title, year: args.year }).then((data) => {
            callback(data.statusCode, data);
        });
    }

    return {
        firstRun: firstRun
    }
}

module.exports = bootstrap;
var _ = require('lodash');
var colors = require('colors');
var Repo = require('./repo');
var Imdb = require('./imdb');
var backoff = require('backoff');
var Smb = require('smb2');
var bootFile = require('./boot');

var bootstrap = () => {
    var movieDrive = bootFile.drives[0];

    const smbClient = new Smb({
        share: movieDrive.videoDriveAddress,
        domain: '',
        username: movieDrive.videoDriveUserName,
        password: movieDrive.videoDrivePassword
    });

    var repo = Repo();
    var imdb = Imdb();
    var dir = movieDrive.videoDirectory;

    var firstRun = function () {
        try {
            repo.movieReferenceCount().then((count) => {
                if (count <= 0) {
                    console.log(colors.bgWhite("Bootstrap: populating db"));
                    smbClient.readdir(dir, (err, dirs) => {

                        imdb.genres().then((data) => {
                            var genres = data.response.genres;

                            repo.createGenres(data.response).then(() => {

                                dirs.forEach(function (element) {
                                    createMovie({ element: element, genres: genres });
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

    var importNew = function () {
        repo.getGenres().then((data) => {
            var genres = data[0].genres;
            smbClient.readdir(dir, (err, dirs) => {
                dirs.forEach(function (element) {
                    repo.getReference({ title: element }).then((data) => {
                        if (data == null) {
                            createMovie({ element: element, genres: genres });
                        }
                    }).catch((err) => {
                        console.log(colors.bgRed(err));
                    });
                });
            });
        });
    }

    function getMovies(args, callback) {
        imdb.findMovie({ title: args.title, year: args.year }).then((data) => {
            callback(data.statusCode, data);
        });
    }

    function createMovie(args) {
        var element = args.element;
        var genres = args.genres;

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
    }

    return {
        firstRun: firstRun,
        importNew: importNew
    }
}

module.exports = bootstrap;
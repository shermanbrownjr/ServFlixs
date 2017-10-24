var express = require('express');
var router = express.Router();
var Repo = require('./repo');
var colors = require('colors');
var graphqlHTTP = require('express-graphql');
var movieSchema = require('./movieSchema');
var moment = require('moment');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var Chromecast = require('./chromecast');
var ip = require('ip'); 

var appRouter = (args) => {

    var title = args.title;
    var port = args.port;
    var repo = Repo();

    router.route('/')
        .get((req, res) => {
            repo.getGenres().then((data) => {
                populateMovieCategories({ data: data[0] }, (categories) => {
                    res.render('index', { title: title, categories: categories })
                });
            }).catch((err) => {
                console.log(colors.bgRed(err));
            });
        });

    router.route('/:title')
        .get((req, res) => {
            repo.getMovie({ title: req.params.title }).then((data) => {

                var movie = {
                    dir: data.directory,
                    video: getFilePath(data.directory),
                    vote: data.details.vote_count,
                    voteAvg: `${_.round((data.details.vote_average / 10) * 100)}% User Score`,
                    title: data.details.title.replace(/\s+/g, " "),
                    popularityScore: data.details.popularity,
                    posterPath: data.details.poster_path,
                    backdropPath: data.details.backdrop_path,
                    overview: data.details.overview,
                    releaseDate: moment(data.details.release_date).format('MMMM YYYY'),
                    genres: _.map(data.details.genre_ids, 'name').join(' / ')
                }

                res.render('movie', { title: title, movie: movie })
            }).catch((err) => {
                console.log(colors.bgRed(err));
            });
        });

    router.route('/:title/:video')
        .get((req, res) => {
            var file = path.resolve('/Volumes/Videos/Movies/', req.params.title, req.params.video);

            var stat = fs.statSync(file);
            var total = stat.size;

            res.header('Content-Length', total);
            res.header("Content-Type", `video/${path.extname(file).replace('.', '')}`);
            res.sendFile(file);
        });

    router.route('/download/:title/:video')
        .get((req, res) => {

            var file = path.resolve('/Volumes/Videos/Movies/', req.params.title, req.params.video);

            var stat = fs.statSync(file);
            var total = stat.size;

            res.header('Content-Length', total);
            res.header("Content-Type", `video/${path.extname(file).replace('.', '')}`);
            res.download(file);
        });

    router.route('/cast/:title/:video')
        .get((req, res) => {
            if (typeof req.session.cast === 'undefined' || req.session.cast.dir != req.params.title ) {
                repo.getMovie({ title: req.params.title }).then((data) => {

                    req.session.cast = {
                        dir: data.directory,
                        video: `http://${ip.address()}:${port}/${req.params.title}/${req.params.video}`,
                        vote: data.details.vote_count,
                        voteAvg: `${_.round((data.details.vote_average / 10) * 100)}% User Score`,
                        title: data.details.title.replace(/\s+/g, " "),
                        popularityScore: data.details.popularity,
                        posterPath: data.details.poster_path,
                        backdropPath: data.details.backdrop_path,
                        overview: data.details.overview,
                        releaseDate: moment(data.details.release_date).format('MMMM YYYY'),
                        genres: _.map(data.details.genre_ids, 'name').join(' / '),
                        state: 'play'
                    }

                    var cast = Chromecast({ media: req.session.cast.video });
                    cast.start();

                    res.render('cast', { title: title, movie: req.session.cast });
                }).catch((err) => {
                    console.log(colors.bgRed(err));
                });
            }
            else {
                res.render('cast', { title: title, movie: req.session.cast });
            }
        });

    router.route('/cast/stop')
        .post((req, res) => {
            var cast = Chromecast({ media: req.session.cast.video });
            cast.stop();

            delete req.session.cast;
            res.sendStatus(200);
        });

    router.route('/cast/pause')
        .post((req, res) => {
            var cast = Chromecast({ media: req.session.cast.video });
            cast.pause();
            req.session.cast.state = 'pause';
            res.sendStatus(200);
        });

    router.route('/cast/play')
        .post((req, res) => {
            var cast = Chromecast({ media: req.session.cast.video });
            cast.play();
            req.session.cast.state = 'play';
            res.sendStatus(200);
        });

    router.route('/cast/seek')
        .post((req, res) => {
            var cast = Chromecast();
            cast.seek(Number(req.body.seconds));
            res.sendStatus(200);
        });

    router.use('/movie/api', graphqlHTTP({
        schema: movieSchema,
        pretty: true,
        graphiql: true
    }));

    function populateMovieCategories(args, callback) {
        try {
            var categories = [];

            args.data.genres.forEach(async (element, index, arr) => {
                var category = { genre: element };

                var data = await repo.getMoviesByGenre({ genre: category.genre });

                if (data.length > 3) {
                    category.movies = _.shuffle(data);
                    categories.push(category);
                }

                if (index == (arr.length - 1)) {
                    callback(categories);
                }

            });
        }
        catch (err) {
            console.log(colors.bgRed.yellow(err));
        }
    }

    function getFilePath(title) {
        var dir = path.resolve('/Volumes/Videos/Movies/', title);

        var files = fs.readdirSync(dir).filter(file => !_.startsWith(file, '._') && (_.endsWith(file, ".mp4") || _.endsWith(file, ".avi") || _.endsWith(file, ".m4v")));
        console.log(files);
        return files[0];
    }

    return router;
};

module.exports = appRouter;
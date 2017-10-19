var express = require('express');
var movieRouter = express.Router();
var Repo = require('./repo');
var colors = require('colors');
var graphqlHTTP = require('express-graphql');
var movieSchema = require('./movie-schema');
var moment = require('moment');
var _ = require('lodash');

var router = (args) => {

    var repo = Repo();

    movieRouter.route('/')
        .get((req, res) => {
            repo.getGenres().then((data) => {
                populateMovieCategories({ data: data[0] }, (categories) => {
                    res.render('index', { title: args.title, categories: categories })
                });
            }).catch((err)=>{
                console.log(colors.bgRed.yellow(err));
            });
        });

    movieRouter.route('/:title')
        .get((req, res) => {
            repo.getMovie({title: req.params.title}).then((data)=>{
            
                var movie = {
                    vote: data.details.vote_count,
                    voteAvg: `${_.round((data.details.vote_average/10)*100)}% User Score`,
                    title: data.details.title.replace(/\s+/g, " "),
                    popularityScore: data.details.popularity,
                    posterPath: data.details.poster_path,
                    backdropPath: data.details.backdrop_path,
                    overview: data.details.overview,
                    releaseDate: moment(data.details.release_date).format('MMMM YYYY'),
                    genres : _.map(data.details.genre_ids,'name').join(' / ')
                }

                res.render('movie', { title: args.title, movie: movie })
            });
        });

    movieRouter.use('/movie/api', graphqlHTTP({
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

    return movieRouter;
};

module.exports = router;
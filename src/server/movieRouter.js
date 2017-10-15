var express = require('express');
var movieRouter = express.Router();
var Repo = require('./repo');

var router = (args) => {

    var repo = Repo();

    movieRouter.route('/')
        .get((req, res) => {
            repo.getGenres().then((data) => {
                populateMovieCategories(data, (categories)=>{
                    res.render('index', { title: args.title, categories: categories })
                });
            });
        });

    function populateMovieCategories(args, callback) {
            try {
                var categories = [];

                args.genres.forEach(function (element) {
                    var category = { genre: element };

                    repo.getMoviesByGenre({ genre: category.genre }).then((data) => {
                        category.movies = data;
                        categories.push(category);
                    });
                });
            }
            catch (err) {
                console.log(colors.bgRed.yellow(err));
            }
    }

    return movieRouter;
};

module.exports = router;
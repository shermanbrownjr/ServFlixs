var express = require('express');
var movieRouter = express.Router();
var Repo = require('./repo');
var colors = require('colors');

var router = (args) => {

    var repo = Repo();

    movieRouter.route('/')
        .get((req, res) => {
            repo.getGenres().then((data) => {
                populateMovieCategories({ data: data[0] }, (categories) => {
                    res.render('index', { title: args.title, categories: categories })
                });
            });
        });

    function populateMovieCategories(args, callback) {
        try {
            var categories = [];

            args.data.genres.forEach(async (element, index, arr) => {
                var category = { genre: element };

                var data = await repo.getMoviesByGenre({ genre: category.genre });

                if (data.length > 3) {
                    category.movies = shuffle(data);
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

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    return movieRouter;
};

module.exports = router;
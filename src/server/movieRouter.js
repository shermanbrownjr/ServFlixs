var express = require('express');
var movieRouter = express.Router();
var Repo = require('./repo');

var router = (args) => {
    
    var repo = Repo(); 

    movieRouter.route('/')
        .get((req, res) => {
            repo.getMovies().then((data) => {
                res.render('index', { title: args.title, movies: data })
            })
        });

    return movieRouter;
};

module.exports = router;
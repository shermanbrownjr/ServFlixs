var request = require("request");
var colors = require('colors');
var bootFile = require('./boot');

var imdb = () => {
    var findMovie = (args) => {

        return new Promise((resolve, reject) => {

            var options = {
                method: 'GET',
                url: 'https://api.themoviedb.org/3/search/movie',
                qs:
                {
                    api_key: bootFile.theMovieDbApiKey,
                    language: 'en-US',
                    query: args.title,
                    page: '1',
                    include_adult: 'false',
                    year: args.year
                },
                time: true,
                json: true
            };


            request(options, (error, response, body) => {
                try {

                    resolve(buildResponse(error, response, body));
                }
                catch (err) {
                    console.log(colors.bgRed.yellow(err));
                    reject(err);
                }
            });

        });
    }

    var genres = () => {

        return new Promise((resolve, reject) => {

            var options = {
                method: 'GET',
                url: 'https://api.themoviedb.org/3/genre/movie/list',
                qs:
                {
                    api_key: bootFile.theMovieDbApiKey,
                    language: 'en-US'
                },
                time: true,
                json: true
            };


            request(options, (error, response, body) => {
                try {

                    resolve(buildResponse(error, response, body));
                }
                catch (err) {
                    console.log(colors.bgRed.yellow(err));
                    reject(err);
                }
            });

        });
    }

    function buildResponse(error, response, body) {
        return {
            error: error,
            response: body,
            statusCode: response.statusCode,
            statusMessage: response.statusMessage,
            timeElasped: response.timingPhases.total,
            count: body.length
        };
    }

    return {
        findMovie: findMovie,
        genres: genres
    }
}

module.exports = imdb;
var mongodb = require('mongodb').MongoClient;
var bootFile = require('./boot');
var colors = require('colors');

var repository = () => {

    var movieReferenceCount = () =>{
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var collection = db.collection('reference');
                    collection.count(function (err, count) {
                        resolve(count);
                    });
                });
            }
            catch (err) {
                console.log(colors.bgRed.yellow(err));
                reject(err);
            }
        });
    }

    var createMovieReference = (args)=>{
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var collection = db.collection('reference');
                    collection.insertOne(args.reference,
                        (err, results) => {
                            resolve(results);
                        }
                    );
                });
            }
            catch (err) {
                console.log(colors.bgRed.yellow(err));
                reject(err);
            }
        });
    }

    var createMovie = (args) => {
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var collection = db.collection('movies');
                    collection.insertOne(args.movie,
                        (err, results) => {
                            resolve(results);
                        }
                    );
                });
            }
            catch (err) {
                console.log(colors.bgRed.yellow(err));
                reject(err);
            }
        });
    }

    var getMovies = () => {
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var collection = db.collection('movies');
                    collection.find({}).toArray(
                        (err, results) => {
                            resolve(results);
                        }
                    );
                });
            }
            catch (err) {
                console.log(colors.bgRed.yellow(err));
                reject(err);
            }
        });
    }

    return {
        movieReferenceCount: movieReferenceCount,
        createMovieReference: createMovieReference,
        createMovie: createMovie,
        getMovies: getMovies,
    }
}

module.exports = repository;
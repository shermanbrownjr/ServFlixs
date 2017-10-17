var mongodb = require('mongodb').MongoClient;
var bootFile = require('./boot');
var colors = require('colors');

var repository = () => {

    var movieReferenceCount = () => {
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

    var createMovieReference = (args) => {
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

    var createGenres = (args) => {
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var collection = db.collection('genres');
                    collection.insertOne(args,
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

    var getMovie = (args) => {
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var query = { 'details.title': args.title };
                    var collection = db.collection('movies');
                    collection.findOne(query, (err, results) => {
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

    function getMoviesByGenre(args) {
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var query = { 'details.genre_ids': args.genre };
                    var collection = db.collection('movies');
                    collection.find(query, {
                        directory: 1,
                        "details.title": 1,
                        "details.poster_path": 1,
                        "details.release_date": 1,
                        "details.vote_average": 1
                    }).toArray(
                        (err, results) => {
                            resolve(results);
                        });
                });
            }
            catch (err) {
                console.log(colors.bgRed.yellow(err));
                reject(err);
            }
        });
    }

    var getGenres = () => {
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var collection = db.collection('genres');
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

    var getReference = (args) => {
        return new Promise((resolve, reject) => {
            try {
                mongodb.connect(bootFile.connectionString, (err, db) => {
                    var query = { "title": { $regex: `.*${args.title}.*`, $options: "i" } };

                    var collection = db.collection('reference');
                    collection.findOne(query, (err, results) => {
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
        createGenres: createGenres,
        getMovie: getMovie,
        getMovies: getMovies,
        getMoviesByGenre: getMoviesByGenre,
        getGenres: getGenres,
        getReference: getReference

    }
}

module.exports = repository;
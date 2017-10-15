var _ = require('lodash');
var Repo = require('./repo');
var Imdb = require('./imdb');

var upload = (args) => {
    var smbClient = args.smbClient;
    var repo = Repo(args.connectionString);
    var imdb = Imdb();

    var bootstrap = (args) => {
        return new Promise((resolve, reject) => {
            try {
                smbClient.readdir(args.dir, (err, dirs) => {
                    dirs.forEach(function (element) {
                        var splitName = element.split(" ");
                        var year = element[(splitName.length - 1)];

                        if (_.isNumber(year)) {
                            var title = _.take(splitName, (splitName.length - 2)).join(' ');

                            imdb.findMovie({ title: title, year = year }).then((data) => {
                                repo.createMovies({ movies: data }).then((data) => {
                                    console.log(`uploaded ${element}`);
                                })
                            })
                        }
                    });
                });

                resolve();
            }
            catch (e) {
                reject(e);
            }
        });
    }

    return {
        bootstrap: bootstrap
    }
}

module.exports = upload;
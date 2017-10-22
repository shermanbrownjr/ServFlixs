const graphql = require('graphql');
var repo = require('./repo')();
var _ = require('lodash');

const movie = new graphql.GraphQLObjectType({
    name: 'Movie',
    fields: () => ({
        vote: {
            type: graphql.GraphQLInt
        },
        voteAvg: {
            type: graphql.GraphQLFloat
        },
        title: {
            type: graphql.GraphQLString
        },
        popularityScore: {
            type: graphql.GraphQLFloat
        },
        posterPath: {
            type: graphql.GraphQLString
        },
        backdropPath: {
            type: graphql.GraphQLString
        },
        overview: {
            type: graphql.GraphQLString
        },
        releaseDate: {
            type: graphql.GraphQLString
        }
    })
});

const localReference = new graphql.GraphQLObjectType({
    name: 'Reference',
    fields: () => ({
        title: {
            type: graphql.GraphQLString
        },
        onboarded: {
            type: graphql.GraphQLBoolean
        }
    })
});

const schema = new graphql.GraphQLSchema({
    query: new graphql.GraphQLObjectType({
        name: 'query',
        fields: () => ({
            movie: {
                args: {
                    title: {
                        name: 'title',
                        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                    }
                },
                type: movie,
                resolve: (root, args) => {
                    return repo.getMovie(args).then((data) => {
                        return {
                            vote: data.details.vote_count,
                            voteAvg: data.details.vote_average,
                            title: data.details.title.replace(/\s+/g, " "),
                            popularityScore: data.details.popularity,
                            posterPath: data.details.poster_path,
                            backdropPath: data.details.backdrop_path,
                            overview: data.details.overview,
                            releaseDate: data.details.release_date
                        }
                    });
                }
            },
            titles: {
                type: new graphql.GraphQLList(graphql.GraphQLString),
                resolve: (root, args) =>{
                    return repo.getMovies().then((data) =>{ 
                            return _.map(data,'directory')
                    });
                }
            },
            reference: {
                args: {
                    title: {
                        name: 'title',
                        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                    }
                },
                type: localReference,
                resolve: (root, args) => {
                    console.log('here');
                    return repo.getReference(args).then((data) => {
                        return {
                            title: data.title,
                            onboarded: data.onboarded
                        }
                    });
                }
            }
        })
    })
});

module.exports = schema;
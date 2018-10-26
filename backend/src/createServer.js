const { GraphQLServer } = require('graphql-yoga');
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');
const db = require('./db');

// create the graphql yoga server
function createServer() {
  return new GraphQLServer({
    // GraphQL Server needs its own schema and typeDefs
    typeDefs: 'src/schema.graphql', // injests schema
    // resolvers will match above schema with mutation / query
    resolvers: {
      Mutation,
      Query
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false,
    },
    // need to access db from resolvers, context allows this
    context: req => ({ ...req, db }), // expose db to every single request
  }) 
}

module.exports = createServer;


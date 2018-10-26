// this file connects to the remote prisma DB and gives us the ability to query it with JS
const { Prisma } = require('prisma-binding');

const db = new Prisma({
  // type definitions, need to know everything about the schema so need to feed it
  typeDefs: 'src/generated/prisma.graphql', 
  // give access to prisma db
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  // if true, console.log's all queries/mutations
  debug: false,
})

module.exports = db;
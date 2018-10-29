const { forwardTo } = require('prisma-binding'); // prisma binding gives us ability to query DB

const Query = {
  // anytime someone queries for items we're just going to forward that to db
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db')

  // unncessary if exact same as prisma, see above forwardTo
  // async items(parent, args, ctx, info) {
  //   // rememeber, check the prisma data model and see what is available to you.
  //   const items = await ctx.db.query.items(); // 
  //   return items;
  // }
};


module.exports = Query;

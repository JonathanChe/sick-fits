const { forwardTo } = require("prisma-binding"); // prisma binding gives us ability to query DB
const { hasPermission } = require("../utils");

const Query = {
  // anytime someone queries for items we're just going to forward that to db
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current user id
    if (!ctx.request.userId) {
      // important to return null instead of throwing an error
      // want query to return nothing because user might not be logged in
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId }
      },
      info
    );
  },

  async users(parent, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) throw new Error("You must be logged in");
    // check if user has permissions to query for users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    //if they do, query all users
    return ctx.db.query.users({}, info);
  },

  async order(parent, args, ctx, info) {
    // Make sure they are logged in
    if (!ctx.request.userId) throw new Error("You are not logged in!");
    // query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id }
      },
      info
    );
    // check if they have the permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermission)
      throw new Error("User does not have permission");
    // return the order
    return order;
  }
};

module.exports = Query;

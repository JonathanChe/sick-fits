const Mutations = {
  async createItem(parent, args, ctx, info) { // info holds the actual query
    // TODO: Check if they are logged in

    // here is where we interface with prisma database
    const item = await ctx.db.mutation.createItem({ // refers to context defined in createServer.js, // accesses db from ctx
      // 

      data: { // refers to schema.graphql and how the api created takes in an argument data
        ...args // because all of the fields being pulled in need to go directly to the item, we can just do ...args instead of manually putting each key/val in. 
      }
    }, info) // pass info so that the actual item is returned to us after we have created it.  

    return item;
  }
};

module.exports = Mutations;

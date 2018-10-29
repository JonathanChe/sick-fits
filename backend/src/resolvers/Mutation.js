const Mutations = {
  async createItem(parent, args, ctx, info) { // info holds the actual query
    // TODO: Check if they are logged in

    // here is where we interface with prisma database
    const item = await ctx.db.mutation.createItem({ // refers to context defined in createServer.js, // accesses db from ctx

      data: { // refers to schema.graphql and how the api created takes in an argument data
        ...args // because all of the fields being pulled in need to go directly to the item, we can just do ...args instead of manually putting each key/val in. 
      }
    }, info) // pass info so that the actual item is returned to us after we have created it.  

    return item;
  },

  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args }

    // remove the ID from the updates, b/c id is not something you can update
    delete updates.id;

    // run the update method
    return ctx.db.mutation.updateItem({
      // data that needs to be updated
      data: updates,
      // pointing at what item needs to be updated
      where: {
        id: args.id
      }
    },
      // second arg
      info // what it needs to return
    );
  }, 
  
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item 
    const item = await ctx.db.query.item({ where }, `{id title}`); // passing in raw graphql
    // 2. check if they own that item or have the permissions
    // TODO
    // 3. delete
    return ctx.db.mutation.deleteItem({ where }, info);
  }
  
};

module.exports = Mutations;

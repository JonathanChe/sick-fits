const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    // find the item 
    const item = await ctx.db.query.item({ where }, `{id title}`); // passing in raw graphql query
    // check if they own that item or have the permissions
    // TODO
    // delete
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  
  async signup(parent, args, ctx, info) {
    // lowercase incoming emails
    args.email = args.email.toLowerCase();
    // hash password
    const password = await bcrypt.hash(args.password, 10);
    // create user in DB
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password, // do not store plain text password, override with hash
        permissions: { set: ['USER'] }

      }
    }, info); // info is being returned to client

    // create JWT 
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    // set the JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true, // cannot access cookie via JS 
      maxAge: 1000 * 60 * 60 * 24 * 365
    });
    // return user to the browser
    return user;
  }

};

module.exports = Mutations;

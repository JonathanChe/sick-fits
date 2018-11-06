// npm imports
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

// rel path imports
const { transport, makeANiceEmail } = require('../mail');
const { hasPermission } = require('../utils');

const Mutations = {
  async createItem(parent, args, ctx, info) { // info holds the actual query
    // Check if they are logged in
    if (!ctx.request.userId) throw new Error('You must be logged in to do that!');

    // here is where we interface with prisma database
    const item = await ctx.db.mutation.createItem({ // refers to context defined in createServer.js, // accesses db from ctx

      data: { // refers to schema.graphql and how the api created takes in an argument data
        user: {
          connect: {
            // this is how we create a relationship between the Item and the user
            id: ctx.request.userId
          }
        },
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
    const item = await ctx.db.query.item({ where }, `{id title user { id }}`); // passing in raw graphql query

    // check if they own that item or have the permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));

    // exit out of function if user does not have permission
    if (!ownsItem && !hasPermissions) throw new Error("You don't have permission to do that");

    // delete if user has permission
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
  },

  async signin(parent, { email, password }, ctx, info) {
    // check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email }});
    if (!user) throw new Error(`No such user found for email ${email}`);

    // check if their password is corrrect
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid Password');

    // generate JWT token & set coookie with token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true, 
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },
  
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },

  async requestReset(parent, args, ctx, info) {
    // check if email is a real user
    const user = await ctx.db.query.user({ where: { email: args.email }});
    if (!user) throw new Error(`No such user found for email ${args.email}`);
    // set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000 // 1hr from now
    const res = ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    })
    // email them that reset token
    const mailRes = await transport.sendMail({
      from: 'jonathan.che@outlook.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`Your Password Reset Token is here! 
        \n\n 
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
        Click Here to Reset</a>`)
    })
    return { message: "thanks"};
  },

  async resetPassword(parent, args, ctx, info) {
    // check if passwords match
    if (args.password !== args.confirmPassword) throw new Error('Passwords do not match');

    // check if its a legit reset token & expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken, 
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    })
    if (!user) throw new Error('This token is either invalid or expired');
    // hash new password
    const password = await bcrypt.hash(args.password, 10);
    // save new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    // generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    // set JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })
    // return the new user
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    // check if user is logged in
    if (!ctx.request.userId) throw new Error('You must be logged in');
    // query the current user
    const currentUser = await ctx.db.query.user({ where: { id: ctx.request.userId }}, info);
    // check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    // update permissions
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions
        }
      },
      where: {
        id: args.userId
      }
    }, info);
  },

  async addToCart(parent, args, ctx, info) {
    // make sure user is signed in
    const { userId } = ctx.request;
    if (!userId) throw new Error('You must be logged in');

    // Query the users current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      }
    });

    // check if that item is already in their cart and increment by one if it is
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 }
      }, info);
    }

    // if it's not, create a fresh cart item for that user
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId }
        },
        item: {
          connect: { id: args.id }
        }
      }
    }, info);
  }

};

module.exports = Mutations;

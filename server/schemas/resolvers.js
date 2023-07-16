const { AuthenticationError } = require("apollo-server-express");
const User = require("../models/User");
const Game = require("../models/Game");
const Shop = require("../models/Shop");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      try {
        const users = await User.find({}).populate("game");
        return users;
      } catch (error) {
        throw new Error("Failed to fetch users: " + error.message);
      }
    },
    getUser: async (parent, { _id }) => {
      try {
        const user = await User.findById(_id).populate("game");
        return user;
      } catch (error) {
        throw new Error("Failed to fetch user: " + error.message);
      }
    },
    getByEmailUserName: async (parent, { userNameOrEmail }) => {
      try {
        let user;
        if (userNameOrEmail.includes("@")) {
          user = await User.findOne({ email: userNameOrEmail }).populate(
            "game"
          );
        } else {
          user = await User.findOne({ userName: userNameOrEmail }).populate(
            "game"
          );
        }

        return user;
      } catch (error) {
        throw new Error("Failed to fetch user: " + error.message);
      }
    },
    games: async (parent, { _id }) => {
      try {
        const game = await Game.findById(_id).sort({ createdAt: -1 });
        return game;
      } catch (error) {
        throw new Error("Failed to fetch games: " + error.message);
      }
    },
    shop: async (parent, { _id }) => {
      try {
        const shop = await Shop.findById(_id).sort({ createdAt: -1 });
        return shop;
      } catch (error) {
        throw new Error("Failed to fetch shop: " + error.message);
      }
    },
  },
  Mutation: {
    createUser: async (parent, { input }) => {
      try {
        const { firstName, lastName, email, password } = input;
        const game = await Game.create({
          name: "minal-fantasy-game",
          level: 0,
        });
        const shop = await Shop.create({
          name: "minal-fantasy-shop",
          items: [],
        });
        const user = await User.create({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
          game: game._id,
          shop: shop._id,
        });
        const token = signToken(user);
        return { token, user };
      } catch (error) {
        throw new Error("Failed to create user: " + error.message);
      }
    },
    login: async (parent, { email, password }) => {
      try {
        const user = await User.findOne({ email }).populate("game");
        if (!user) {
          throw new AuthenticationError(
            `No user found with this email ${email}`
          );
        }

        const verifiedPassword = await user.isCorrectPassword(password);
        if (!verifiedPassword) {
          throw new AuthenticationError("Incorrect credentials");
        }

        const token = signToken(user);
        return { token, user };
      } catch (error) {
        throw new Error("Failed to login: " + error.message);
      }
    },
  },
};

module.exports = resolvers;

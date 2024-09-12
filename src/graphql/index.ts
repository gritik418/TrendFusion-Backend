import { ApolloServer } from "@apollo/server";
import { Query } from "mongoose";

const gqlServer = new ApolloServer({
  typeDefs: `
        type User{
            firstName: String
        }

        type Query {
            user: User
        }
    `,
  resolvers: {
    Query: {
      user: () => {
        return { firstName: "Hellp" };
      },
    },
  },
});

export default gqlServer;

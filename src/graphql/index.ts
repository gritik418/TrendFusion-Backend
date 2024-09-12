import { ApolloServer } from "@apollo/server";
import product from "./product";

const gqlServer = new ApolloServer({
  typeDefs: product.typeDefs,
  resolvers: product.resolvers,
});

export default gqlServer;

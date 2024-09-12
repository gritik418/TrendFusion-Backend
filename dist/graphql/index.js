"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const gqlServer = new server_1.ApolloServer({
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
exports.default = gqlServer;

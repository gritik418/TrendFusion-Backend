"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeDefs = `#graphql
    scalar JSON

    type Product {
        _id: ID!
        productId: String!
        title: String!
        brand: String
        description: String!
        thumbnail: String!
        isAvailable: Boolean!
        images: [String]
        category: String
        price: Int!
        warranty: String
        discount: Discount
        rating: Int
        stock: Int!
        color: String
        size: String
        highlights: [String]
        specifications: JSON
        offers: JSON
    }

    type Discount {
        discountType: DiscountType
        value: Int
        description: String
    }

    enum DiscountType {
        Percentage
        Fixed
    }

    type Query {
        product: Product
    }
`;
exports.default = typeDefs;

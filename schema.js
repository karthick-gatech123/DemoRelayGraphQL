// prototype
// relay on server side uses graphql-relay-js

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull,
    GraphQLInt,
} = require('graphql');

const {
    nodeDefinitions,
    globalIdField,
    connectionDefinitions,
    connectionArgs,
    connectionFromArray,
} = require('graphql-relay-js');

const data = require('./data');

// 1. Node Interface (Global Object Identification)
// This is crucial for Relay's caching and refetching.
// It creates a 'Node' interface and a 'node' field at the root query.
const { nodeInterface, nodeField } = nodeDefinitions(
    (globalId) => {
        // This function tells Relay how to resolve a global ID back to an object
        const { type, id } = globalId; // We'll manually parse for this example
        
        // We'll simplify this parsing here for the prototype.
        // A more robust implementation would use fromGlobalId from graphql-relay-js
        const parts = globalId.split(':');
        const decodedType = parts[0];
        const decodedId = parts[1];

        // Fetch the object based on its type and local ID
        // Our data.getObjectById function simplifies this for the prototype
        const obj = data.getObjectById(decodedId);
        if (obj && obj.__typename === decodedType) {
            return obj;
        }
        return null;
    },
    (obj) => {
        if (obj.__typename === 'User') {
            return UserType;
        }
        if (obj.__typename === 'Post') {
            return PostType;
        }
        return null;
    }
);

// 2. Define our custom types (User, Post) and make them implement Node
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'A user in the system',
    fields: () => ({
        id: globalIdField('User'),
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        city: { type: GraphQLString },
        posts: {
            type: PostConnection, // The connection type we define below
            args: connectionArgs, // Relay standard arguments for connections (first, after, etc.)
            resolve: (user, args) => {
                return connectionFromArray(data.getPostsByAuthor(user.id), args);
            },
        },
    }),
    interfaces: [nodeInterface], // Important: Declare that UserType implements Node
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'A user post',
    fields: () => ({
        id: globalIdField('Post'),
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        author: {
            type: UserType,
            resolve: (post) => data.getUser(post.authorId),
        },
    }),
    interfaces: [nodeInterface], // Important: Declare that PostType implements Node
});

// 3. Define Connections for lists (e.g., list of Posts for a User)
const { connectionType: PostConnection } = connectionDefinitions({
    nodeType: PostType,
    connectionFields: () => ({
        // You can add additional fields to the connection if needed
        totalCount: {
            type: GraphQLInt,
            resolve: (connection) => connection.edges.length, 
        },
    }),
});

// Root Query Type
const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        node: nodeField, // This is the Relay standard node field for refetching by ID
        viewer: { // A common Relay pattern to access the current logged-in user
            type: UserType,
            resolve: () => data.getUser('1'), // For this prototype, 'viewer' is always user 1
        },
        user: { // A specific user query by ID
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: (root, { id }) => data.getUser(id),
        },
        allUsers: {
            type: new GraphQLList(UserType),
            resolve: () => data.users,
        },
        allPosts: {
            type: new GraphQLList(PostType),
            resolve: () => data.posts,
        },
    }),
});

const Schema = new GraphQLSchema({
    query: QueryType,
});

module.exports = Schema;

const { ApolloServer } = require("apollo-server");
const { PNPubSub } =  require("graphql-pubnub-subscriptions");
const typeDefs = require("./typedefs.js");

const BOOK_ADDED = "BOOK_ADDED";
const BOOK_REMOVED = "BOOK_REMOVED";


const pubsub = new PNPubSub({
  subscribeKey: "", // get subscribe key
  publishKey: "", // get publish key
  debug: true,
});

const books = [
  {
    id: 1,
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: 2,
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
  Mutation: {
    addBook() {
      const book = {
        title: "City of Glass",
        author: "Paul Auster",
        id: new Date(),
      }
      pubsub.publish(BOOK_ADDED, { bookAdded: book });
      books.push(book);
      return book
    },
    removeBook() {
      pubsub.publish(BOOK_REMOVED, { bookRemoved: false });
      return false
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator([BOOK_ADDED]),
      resolve: (payload, _args, _context, _info) => {
        return payload.message.bookAdded;
      },
    },
    bookRemoved: {
      subscribe: () => pubsub.asyncIterator([BOOK_REMOVED]),
      resolve: (payload, _args, _context, _info) => {
        return payload.message.bookRemoved;
      },
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});




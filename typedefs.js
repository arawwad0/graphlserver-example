const { gql } = require("apollo-server");

module.exports = gql`
  type Book {
    id: Int
    title: String
    author: String
  }
  type Query {
    books: [Book]
  }
  type Mutation {
    addBook(title: String, author: String): Book
    removeBook: Boolean
  }
  type Subscription {
    bookAdded: Book
    bookRemoved: Boolean
  }
`

// import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect } from "react";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

// import { getMe, deleteBook } from "../utils/API";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { computeHeadingLevel } from "@testing-library/react";

const GET_ME = gql`
  query Query {
    me {
      _id
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;

const DELETE_BOOK = gql`
  mutation Mutation($bookId: ID!) {
    removeBook(bookId: $bookId) {
      username
      savedBooks {
        title
      }
    }
  }
`;

const SavedBooks = () => {
  const userData = useQuery(GET_ME);
  const [executeDeleteBook] = useMutation(DELETE_BOOK);
  const handleDeleteBook = async (bookId) => {
    console.log(`book delete ${bookId}`);
    const { data, error } = await executeDeleteBook({
      variables: {
        bookId,
      },
    });
  };

  if (userData.loading) {
    return <h2>LOADING...</h2>;
  }
  // console.log(userData);

  return (
    <>
      <Jumbotron fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData.data.me.savedBooks.length
            ? `Viewing ${userData.data.me.savedBooks.length} saved ${
                userData.data.me.savedBooks.length === 1 ? "book" : "books"
              }:`
            : "You have no saved books!"}
        </h2>
        <CardColumns>
          {userData.data.me.savedBooks.map((book) => {
            return (
              <Card key={book.bookId} border="dark">
                {book.image ? (
                  <Card.Img
                    src={book.image}
                    alt={`The cover for ${book.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className="small">Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className="btn-block btn-danger"
                    onClick={() => handleDeleteBook(book.bookId)}
                  >
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;

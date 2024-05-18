/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      createdAt
      name
      description
      updatedAt
      __typename
    }
  }
`;
export const listTasks = /* GraphQL */ `
  query ListTasks(
    $filter: ModelTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        name
        description
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      createdAt
      email
      firstName
      lastName
      username
      updatedAt
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        createdAt
        email
        firstName
        lastName
        username
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getUserTask = /* GraphQL */ `
  query GetUserTask($id: ID!) {
    getUserTask(id: $id) {
      id
      taskId
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listUserTasks = /* GraphQL */ `
  query ListUserTasks(
    $filter: ModelUserTaskFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserTasks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        taskId
        userId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const usersByUsername = /* GraphQL */ `
  query UsersByUsername(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        createdAt
        email
        firstName
        lastName
        username
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

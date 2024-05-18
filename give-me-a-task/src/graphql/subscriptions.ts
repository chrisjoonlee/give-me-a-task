/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask($filter: ModelSubscriptionTaskFilterInput) {
    onCreateTask(filter: $filter) {
      id
      createdAt
      name
      description
      updatedAt
      __typename
    }
  }
`;
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask($filter: ModelSubscriptionTaskFilterInput) {
    onUpdateTask(filter: $filter) {
      id
      createdAt
      name
      description
      updatedAt
      __typename
    }
  }
`;
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask($filter: ModelSubscriptionTaskFilterInput) {
    onDeleteTask(filter: $filter) {
      id
      createdAt
      name
      description
      updatedAt
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateUserTask = /* GraphQL */ `
  subscription OnCreateUserTask($filter: ModelSubscriptionUserTaskFilterInput) {
    onCreateUserTask(filter: $filter) {
      id
      taskId
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUserTask = /* GraphQL */ `
  subscription OnUpdateUserTask($filter: ModelSubscriptionUserTaskFilterInput) {
    onUpdateUserTask(filter: $filter) {
      id
      taskId
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUserTask = /* GraphQL */ `
  subscription OnDeleteUserTask($filter: ModelSubscriptionUserTaskFilterInput) {
    onDeleteUserTask(filter: $filter) {
      id
      taskId
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;

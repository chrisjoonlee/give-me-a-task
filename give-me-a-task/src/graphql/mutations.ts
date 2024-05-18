/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTask = /* GraphQL */ `
  mutation CreateTask(
    $input: CreateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    createTask(input: $input, condition: $condition) {
      id
      createdAt
      name
      description
      updatedAt
      __typename
    }
  }
`;
export const updateTask = /* GraphQL */ `
  mutation UpdateTask(
    $input: UpdateTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    updateTask(input: $input, condition: $condition) {
      id
      createdAt
      name
      description
      updatedAt
      __typename
    }
  }
`;
export const deleteTask = /* GraphQL */ `
  mutation DeleteTask(
    $input: DeleteTaskInput!
    $condition: ModelTaskConditionInput
  ) {
    deleteTask(input: $input, condition: $condition) {
      id
      createdAt
      name
      description
      updatedAt
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createUserTask = /* GraphQL */ `
  mutation CreateUserTask(
    $input: CreateUserTaskInput!
    $condition: ModelUserTaskConditionInput
  ) {
    createUserTask(input: $input, condition: $condition) {
      id
      taskId
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateUserTask = /* GraphQL */ `
  mutation UpdateUserTask(
    $input: UpdateUserTaskInput!
    $condition: ModelUserTaskConditionInput
  ) {
    updateUserTask(input: $input, condition: $condition) {
      id
      taskId
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteUserTask = /* GraphQL */ `
  mutation DeleteUserTask(
    $input: DeleteUserTaskInput!
    $condition: ModelUserTaskConditionInput
  ) {
    deleteUserTask(input: $input, condition: $condition) {
      id
      taskId
      userId
      createdAt
      updatedAt
      __typename
    }
  }
`;

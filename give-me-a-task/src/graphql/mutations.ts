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
      description
      dueDate
      index
      name
      userId
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
      description
      dueDate
      index
      name
      userId
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
      description
      dueDate
      index
      name
      userId
      updatedAt
      __typename
    }
  }
`;
export const createDailyTask = /* GraphQL */ `
  mutation CreateDailyTask(
    $input: CreateDailyTaskInput!
    $condition: ModelDailyTaskConditionInput
  ) {
    createDailyTask(input: $input, condition: $condition) {
      id
      createdAt
      description
      dueDate
      index
      name
      userId
      updatedAt
      __typename
    }
  }
`;
export const updateDailyTask = /* GraphQL */ `
  mutation UpdateDailyTask(
    $input: UpdateDailyTaskInput!
    $condition: ModelDailyTaskConditionInput
  ) {
    updateDailyTask(input: $input, condition: $condition) {
      id
      createdAt
      description
      dueDate
      index
      name
      userId
      updatedAt
      __typename
    }
  }
`;
export const deleteDailyTask = /* GraphQL */ `
  mutation DeleteDailyTask(
    $input: DeleteDailyTaskInput!
    $condition: ModelDailyTaskConditionInput
  ) {
    deleteDailyTask(input: $input, condition: $condition) {
      id
      createdAt
      description
      dueDate
      index
      name
      userId
      updatedAt
      __typename
    }
  }
`;

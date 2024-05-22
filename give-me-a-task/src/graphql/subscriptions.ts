/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTask = /* GraphQL */ `
  subscription OnCreateTask($filter: ModelSubscriptionTaskFilterInput) {
    onCreateTask(filter: $filter) {
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
export const onUpdateTask = /* GraphQL */ `
  subscription OnUpdateTask($filter: ModelSubscriptionTaskFilterInput) {
    onUpdateTask(filter: $filter) {
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
export const onDeleteTask = /* GraphQL */ `
  subscription OnDeleteTask($filter: ModelSubscriptionTaskFilterInput) {
    onDeleteTask(filter: $filter) {
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
export const onCreateDailyTask = /* GraphQL */ `
  subscription OnCreateDailyTask(
    $filter: ModelSubscriptionDailyTaskFilterInput
  ) {
    onCreateDailyTask(filter: $filter) {
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
export const onUpdateDailyTask = /* GraphQL */ `
  subscription OnUpdateDailyTask(
    $filter: ModelSubscriptionDailyTaskFilterInput
  ) {
    onUpdateDailyTask(filter: $filter) {
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
export const onDeleteDailyTask = /* GraphQL */ `
  subscription OnDeleteDailyTask(
    $filter: ModelSubscriptionDailyTaskFilterInput
  ) {
    onDeleteDailyTask(filter: $filter) {
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

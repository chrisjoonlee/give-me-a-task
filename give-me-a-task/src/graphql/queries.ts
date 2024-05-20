/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchTasks = /* GraphQL */ `
  query SearchTasks(
    $filter: SearchableTaskFilterInput
    $sort: [SearchableTaskSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableTaskAggregationInput]
  ) {
    searchTasks(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        createdAt
        description
        index
        name
        userId
        updatedAt
        __typename
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
              __typename
            }
          }
        }
        __typename
      }
      __typename
    }
  }
`;
export const getTask = /* GraphQL */ `
  query GetTask($id: ID!) {
    getTask(id: $id) {
      id
      createdAt
      description
      index
      name
      userId
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
        description
        index
        name
        userId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

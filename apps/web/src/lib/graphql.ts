import { GraphQLClient } from 'graphql-request';
import { CONFIG } from './config';

export function makeGqlClient(token?: string) {
  return new GraphQLClient(CONFIG.graphqlUrl, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}



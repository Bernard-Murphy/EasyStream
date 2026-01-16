const fallbackGraphqlUrl =
  process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? 'http://localhost:4000/graphql';

const fallbackWsGraphqlUrl =
  process.env.NEXT_PUBLIC_API_GRAPHQL_WS_URL ??
  fallbackGraphqlUrl.replace(/^https?:/, (scheme) => (scheme === 'https:' ? 'wss:' : 'ws:'));

export const CONFIG = {
  graphqlUrl: fallbackGraphqlUrl,
  wsGraphqlUrl: fallbackWsGraphqlUrl,
  restUrl: process.env.NEXT_PUBLIC_API_REST_URL ?? 'http://localhost:4000',
} as const;



export const CONFIG = {
  graphqlUrl:
    process.env.NEXT_PUBLIC_API_GRAPHQL_URL ?? "http://localhost:4000/graphql",
  wsGraphqlUrl:
    process.env.NEXT_PUBLIC_API_GRAPHQL_WS_URL ?? "ws://localhost:4000/graphql",
  restUrl: process.env.NEXT_PUBLIC_API_REST_URL ?? "http://localhost:4000",
} as const;

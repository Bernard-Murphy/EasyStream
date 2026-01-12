import { createClient, Client } from 'graphql-ws';
import { CONFIG } from './config';
import { getToken } from './auth';

let _client: Client | null = null;

function getWsClient(): Client {
  if (_client) return _client;
  _client = createClient({
    url: CONFIG.wsGraphqlUrl,
    connectionParams: async () => {
      const token = getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    lazy: true,
    retryAttempts: 5,
  });
  return _client;
}

export function subscribe<TData = any, TVariables = Record<string, any>>(
  args: { query: string; variables?: TVariables },
  onData: (data: TData) => void,
  onError?: (err: unknown) => void,
) {
  const client = getWsClient();
  const dispose = client.subscribe<TData>(
    { query: args.query, variables: args.variables },
    {
      next: (value) => {
        if (value.data) onData(value.data as TData);
      },
      error: (err) => onError?.(err),
      complete: () => {},
    },
  );
  return dispose;
}



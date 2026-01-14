import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HealthResolver } from './health.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: true,
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req, connectionParams }) => {
        // For graphql-ws subscriptions, Nest won't provide an Express req.
        // We synthesize a minimal req object so guards that read req.headers.authorization work.
        if (req) return { req };
        const headers = (connectionParams ?? {}) as Record<string, any>;
        return { req: { headers } };
      },
    }),
  ],
  providers: [HealthResolver],
})
export class EasyStreamGraphqlModule {}



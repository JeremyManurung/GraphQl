import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";

import { WebSocketLink } from '@apollo/client/link/ws';
import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';


const httpLink = new HttpLink({
  uri: 'https://kampusmerdeka.hasura.app/v1/graphql',
  headers: {
      'x-hasura-admin-secret' : 'GJyFmwaJfr1RRinrd2T40xq6njF28njBZ4wb5mrJ5xTVo05p4uHy3iRRK6CpJwOk'
  }
});

const wsLink = new WebSocketLink({
  uri: 'wss://kampusmerdeka.hasura.app/v1/graphql',
  options: {
    reconnect: true,
    connectionParams : {
      headers: {
      'x-hasura-admin-secret' : 'GJyFmwaJfr1RRinrd2T40xq6njF28njBZ4wb5mrJ5xTVo05p4uHy3iRRK6CpJwOk'
      }
    }
  }
});



const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);



const client = new ApolloClient({
  link:splitLink,
  cache: new InMemoryCache(),

});

export default client

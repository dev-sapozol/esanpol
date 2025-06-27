import { ClientError, GraphQLClient } from 'graphql-request';
import {
  GetBasicEmailListQuery,
  GetBasicEmailListDocument,
} from '../../types/graphql';

const client = new GraphQLClient(import.meta.env.VITE_GRAPHQL_API_URL, {
  credentials: 'include',
});

export async function fetchBasicEmailList(): Promise<GetBasicEmailListQuery["getBasicEmailList"] | null> {
  try {
    const { getBasicEmailList } = await client.request<GetBasicEmailListQuery>(
      GetBasicEmailListDocument
    );
    return getBasicEmailList ?? null;
  } catch (err: unknown) {
    if (err instanceof ClientError && [401, 403].includes(err.response.status)) {
      return null;
    }
    throw err; 
  }
}
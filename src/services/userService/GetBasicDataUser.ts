import { ClientError, GraphQLClient } from 'graphql-request';
import {
  GetBasicDataUserQuery,
  GetBasicDataUserDocument,
} from '../../types/graphql';

const client = new GraphQLClient(import.meta.env.VITE_GRAPHQL_API_URL, {
  credentials: 'include',
});

export async function fetchBasicUserData(): Promise<GetBasicDataUserQuery["getBasicDataUser"] | null> {
  try {
    const { getBasicDataUser } = await client.request<GetBasicDataUserQuery>(
      GetBasicDataUserDocument
    );
    return getBasicDataUser ?? null;
  } catch (err: unknown) {
    if (err instanceof ClientError && [401, 403].includes(err.response.status)) {
      return null;
    }
    throw err; 
  }
}

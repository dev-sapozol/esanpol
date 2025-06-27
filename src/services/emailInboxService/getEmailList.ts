import {
  GetEmailListDocument,
  GetEmailListQuery,
  EmailInboxFilter,
} from "../../types/graphql";
import client from "../../apollo/client";

type EmailListInput = Omit<EmailInboxFilter, "folder"> & {
  folder: EmailInboxFilter["folder"];
};

export async function fetchEmailList(
  input: EmailListInput
): Promise<GetEmailListQuery["getEmailList"]> {
  const { data } = await client.query<GetEmailListQuery>({
    query: GetEmailListDocument,
    variables: { input },
    fetchPolicy: "network-only",
  });

  return data.getEmailList;
}

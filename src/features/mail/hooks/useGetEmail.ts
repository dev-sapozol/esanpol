import { gql, useQuery } from "@apollo/client";
import type { Mail } from "../types";

const get_email = gql`
  query GetEmail($id: ID!) {
    get_email(id: $id) {
      id
      subject
      preview
      text_body
      html_body
      inserted_at
      to
      cc
      has_attachment
      importance
      is_read
      folder_type
      folder_id
      sender_name
      sender_email
    }
  }
`;

export function useGetEmail(id: number | string) {
  const { data, loading, error, refetch } = useQuery(get_email, {
    variables: { id: Number(id) },
    skip: !id,
    fetchPolicy: "network-only",
  });

  const mail: Mail | undefined = data?.get_email
    ? {
      id: Number(data.get_email.id),
      subject: data.get_email.subject,
      preview: data.get_email.preview,
      body: data.get_email.text_body,
      htmlBody: data.get_email.html_body,
      senderName:
        data.get_email.sender_name ||
        data.get_email.sender_email,
      senderEmail: data.get_email.sender_email,
      senderAvatar: "",
      inserted_at: data.get_email.inserted_at,
      isRead: data.get_email.is_read,
      section: data.get_email.folder_type.toLowerCase(),
    }
    : undefined;

  return { mail, loading, error, refetch };
}

import { gql, useQuery } from "@apollo/client";
import type { Mail } from "../types";

const get_email = gql`
  query GetEmail($id: ID!) {
    get_email(id: $id) {
      id
      subject
      preview
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
      body_url
      raw_url
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
      bodyUrl: data.get_email.body_url,
      rawUrl: data.get_email.raw_url,
      senderName: data.get_email.sender_name,
      senderEmail: data.get_email.sender_email,
      senderAvatar: "",
      inserted_at: data.get_email.inserted_at,
      isRead: data.get_email.is_read,
      section: data.get_email.folder_type.toLowerCase(),
    }
    : undefined



  return { mail, loading, error, refetch };
}

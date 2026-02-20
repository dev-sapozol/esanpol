interface EmailsByFolder {
  folder_id: number
  folder_type: "SYSTEM" | "USER"
  emails: Mail[]
}

import { useCallback, useMemo } from "react";
import { useQuery, gql } from "@apollo/client";
import type { Mail, MailSection } from "../types";

const preloadMailbox = gql`
  query PreloadMailbox($limit: Int) {
    preload_mailbox(limit: $limit) {
      system_folders {
        id
        name
        folder_type
        total
        unread
      }
      user_folders {
        id
        name
        folder_type
        total
        unread
      }
      emails_by_folder {
        folder_id
        folder_type
        emails {
          id
          to
          subject
          preview
          is_read
          has_attachment
          importance
          folder_id
          folder_type
          inserted_at
          sender_name
          sender_email
        }
      }
    }
  }
`;

export function useMailbox(limit = 50) {
  const { data, loading, error, refetch } = useQuery(preloadMailbox, {
    variables: { limit },
    fetchPolicy: "network-only",
  });

  const systemFolders = data?.preload_mailbox?.system_folders ?? [];
  const userFolders = data?.preload_mailbox?.user_folders ?? [];
  const emailsByFolderRaw = data?.preload_mailbox?.emails_by_folder ?? [];

  const emailsByFolder = useMemo(() => {
    return emailsByFolderRaw.map((folder: any) => ({
      folder_id: folder.folder_id,
      folder_type: folder.folder_type,
      emails: folder.emails.map((email: any): Mail => ({
        id: Number(email.id),
        subject: email.subject,
        senderName: email.sender_name ?? undefined,
        senderEmail: email.sender_email,
        senderAvatar: "",
        preview: email.preview,
        isRead: email.is_read,
        inserted_at: email.inserted_at,
        section: folder.folder_type.toLowerCase() as MailSection,
      })),
    }));
  }, [emailsByFolderRaw]);

  const getEmailsFor = useCallback(
    (folder_type: "SYSTEM" | "USER", folder_id: number) => {
      const f = emailsByFolder.find(
        (g: EmailsByFolder) =>
          Number(g.folder_id) === Number(folder_id) &&
          g.folder_type === folder_type
      );
      return f?.emails ?? [];
    },
    [emailsByFolder]
  );

  return {
    systemFolders,
    userFolders,
    emailsByFolder,
    getEmailsFor,
    loading,
    error,
    refetch,
  };
}

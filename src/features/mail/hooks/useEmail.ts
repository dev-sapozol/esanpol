import { useEffect, useState } from "react";
import {
  GetBasicEmailListQuery,
  GetEmailListQuery,
} from "../../../types/graphql";
import { fetchBasicEmailList } from "../../../services/emailInboxService/getBasicEmailList";
import { fetchEmailList } from "../../../services/emailInboxService/getEmailList";

type BasicEmail = NonNullable<
  NonNullable<GetBasicEmailListQuery["getBasicEmailList"]>[number]
>;
type ListEmail = NonNullable<GetEmailListQuery["getEmailList"]>[number];
type Email = BasicEmail | ListEmail;

const folderMap: Record<string, number> = {
  inbox: 1,
  sent: 2,
  drafts: 3,
  spam: 4,
  trash: 5,
};

export function useEmail(sectionParam: string | undefined) {
  const section = (sectionParam || "inbox").trim().toLowerCase();
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        let data;
        if (section === "inbox") {
          data = await fetchBasicEmailList();
        } else {
          const folder = folderMap[section];
          if (folder === undefined) {
            console.warn(`Sección desconocida '${section}', usando inbox`);
            data = await fetchBasicEmailList();
          } else {
            data = await fetchEmailList({ folder });
          }
        }
        if (mounted) setEmails((data ?? []).filter(Boolean) as Email[]);
      } catch (err) {
        console.error("Error fetching emails:", err);
        if (mounted) setEmails([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [section]);

  return { emails, loading };
}

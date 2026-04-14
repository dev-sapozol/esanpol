import type React from "react"
import MailInbox from "../features/mail/MailInbox"
import Layout from "../layout/layout"

const MailPage: React.FC = () => {
  return (
    <Layout>
      <div className="mail-page">
        <MailInbox />
      </div>
    </Layout>
  )
}

export default MailPage

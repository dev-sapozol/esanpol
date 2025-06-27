/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation CreateEmail($input: CreateEmailInput!) {\n  createEmail(input: $input) {\n    id\n    userId\n    from\n    to\n    cc\n    bcc\n    preview\n    inboxType\n    isRead\n    hasAttachment\n    importance\n    textBody\n    htmlBody\n    folder\n    createdAt\n  }\n}": typeof types.CreateEmailDocument,
    "mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n  updateUser(id: $id, input: $input) {\n    id\n    name\n    email\n    fatherName\n    motherName\n    country\n    gender\n    birthday\n    cellphone\n    age\n    timezone\n    role\n    language\n  }\n}": typeof types.UpdateUserDocument,
    "query GetBasicEmailList {\n  getBasicEmailList {\n    id\n    from\n    to\n    cc\n    subject\n    preview\n    isRead\n    hasAttachment\n    importance\n    threadId\n    folder\n    deletedAt\n    createdAt\n  }\n}": typeof types.GetBasicEmailListDocument,
    "query GetEmailList($input: EmailInboxFilter!) {\n  getEmailList(input: $input) {\n    id\n    from\n    to\n    cc\n    subject\n    preview\n    isRead\n    hasAttachment\n    importance\n    threadId\n    folder\n    deletedAt\n    createdAt\n  }\n}": typeof types.GetEmailListDocument,
    "query GetBasicDataUser {\n  getBasicDataUser {\n    id\n    name\n    fatherName\n    motherName\n    email\n    country\n    cellphone\n    timezone\n    role\n    language\n  }\n}": typeof types.GetBasicDataUserDocument,
};
const documents: Documents = {
    "mutation CreateEmail($input: CreateEmailInput!) {\n  createEmail(input: $input) {\n    id\n    userId\n    from\n    to\n    cc\n    bcc\n    preview\n    inboxType\n    isRead\n    hasAttachment\n    importance\n    textBody\n    htmlBody\n    folder\n    createdAt\n  }\n}": types.CreateEmailDocument,
    "mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n  updateUser(id: $id, input: $input) {\n    id\n    name\n    email\n    fatherName\n    motherName\n    country\n    gender\n    birthday\n    cellphone\n    age\n    timezone\n    role\n    language\n  }\n}": types.UpdateUserDocument,
    "query GetBasicEmailList {\n  getBasicEmailList {\n    id\n    from\n    to\n    cc\n    subject\n    preview\n    isRead\n    hasAttachment\n    importance\n    threadId\n    folder\n    deletedAt\n    createdAt\n  }\n}": types.GetBasicEmailListDocument,
    "query GetEmailList($input: EmailInboxFilter!) {\n  getEmailList(input: $input) {\n    id\n    from\n    to\n    cc\n    subject\n    preview\n    isRead\n    hasAttachment\n    importance\n    threadId\n    folder\n    deletedAt\n    createdAt\n  }\n}": types.GetEmailListDocument,
    "query GetBasicDataUser {\n  getBasicDataUser {\n    id\n    name\n    fatherName\n    motherName\n    email\n    country\n    cellphone\n    timezone\n    role\n    language\n  }\n}": types.GetBasicDataUserDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation CreateEmail($input: CreateEmailInput!) {\n  createEmail(input: $input) {\n    id\n    userId\n    from\n    to\n    cc\n    bcc\n    preview\n    inboxType\n    isRead\n    hasAttachment\n    importance\n    textBody\n    htmlBody\n    folder\n    createdAt\n  }\n}"): (typeof documents)["mutation CreateEmail($input: CreateEmailInput!) {\n  createEmail(input: $input) {\n    id\n    userId\n    from\n    to\n    cc\n    bcc\n    preview\n    inboxType\n    isRead\n    hasAttachment\n    importance\n    textBody\n    htmlBody\n    folder\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n  updateUser(id: $id, input: $input) {\n    id\n    name\n    email\n    fatherName\n    motherName\n    country\n    gender\n    birthday\n    cellphone\n    age\n    timezone\n    role\n    language\n  }\n}"): (typeof documents)["mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {\n  updateUser(id: $id, input: $input) {\n    id\n    name\n    email\n    fatherName\n    motherName\n    country\n    gender\n    birthday\n    cellphone\n    age\n    timezone\n    role\n    language\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetBasicEmailList {\n  getBasicEmailList {\n    id\n    from\n    to\n    cc\n    subject\n    preview\n    isRead\n    hasAttachment\n    importance\n    threadId\n    folder\n    deletedAt\n    createdAt\n  }\n}"): (typeof documents)["query GetBasicEmailList {\n  getBasicEmailList {\n    id\n    from\n    to\n    cc\n    subject\n    preview\n    isRead\n    hasAttachment\n    importance\n    threadId\n    folder\n    deletedAt\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetEmailList($input: EmailInboxFilter!) {\n  getEmailList(input: $input) {\n    id\n    from\n    to\n    cc\n    subject\n    preview\n    isRead\n    hasAttachment\n    importance\n    threadId\n    folder\n    deletedAt\n    createdAt\n  }\n}"): (typeof documents)["query GetEmailList($input: EmailInboxFilter!) {\n  getEmailList(input: $input) {\n    id\n    from\n    to\n    cc\n    subject\n    preview\n    isRead\n    hasAttachment\n    importance\n    threadId\n    folder\n    deletedAt\n    createdAt\n  }\n}"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "query GetBasicDataUser {\n  getBasicDataUser {\n    id\n    name\n    fatherName\n    motherName\n    email\n    country\n    cellphone\n    timezone\n    role\n    language\n  }\n}"): (typeof documents)["query GetBasicDataUser {\n  getBasicDataUser {\n    id\n    name\n    fatherName\n    motherName\n    email\n    country\n    cellphone\n    timezone\n    role\n    language\n  }\n}"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;
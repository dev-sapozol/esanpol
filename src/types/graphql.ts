/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type CreateEmailInput = {
  bcc?: InputMaybe<Scalars['String']['input']>;
  cc?: InputMaybe<Scalars['String']['input']>;
  folder?: InputMaybe<Scalars['Int']['input']>;
  hasAttachment: Scalars['Boolean']['input'];
  htmlBody?: InputMaybe<Scalars['String']['input']>;
  importance: Scalars['Int']['input'];
  inboxType: Scalars['Int']['input'];
  isRead: Scalars['Boolean']['input'];
  preview: Scalars['String']['input'];
  subject: Scalars['String']['input'];
  textBody: Scalars['String']['input'];
  to: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateUserInput = {
  age: Scalars['Int']['input'];
  birthday: Scalars['String']['input'];
  cellphone: Scalars['String']['input'];
  country: Scalars['String']['input'];
  email: Scalars['String']['input'];
  fatherName: Scalars['String']['input'];
  gender: Gender;
  motherName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  timezone: Scalars['String']['input'];
};

export type EmailInbox = {
  __typename?: 'EmailInbox';
  bcc?: Maybe<Scalars['String']['output']>;
  cc?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  deletedAt?: Maybe<Scalars['String']['output']>;
  folder?: Maybe<Scalars['Int']['output']>;
  hasAttachment?: Maybe<Scalars['Boolean']['output']>;
  htmlBody?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  importance?: Maybe<Scalars['Int']['output']>;
  inReplyTo?: Maybe<Scalars['String']['output']>;
  inboxType?: Maybe<Scalars['Int']['output']>;
  isRead?: Maybe<Scalars['Boolean']['output']>;
  preview?: Maybe<Scalars['String']['output']>;
  references?: Maybe<Scalars['String']['output']>;
  s3Url?: Maybe<Scalars['String']['output']>;
  subject?: Maybe<Scalars['String']['output']>;
  textBody?: Maybe<Scalars['String']['output']>;
  threadId?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
};

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER'
}

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  createEmail: EmailInbox;
  createUser: User;
};


export type MutationCreateEmailArgs = {
  input: CreateEmailInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type Query = {
  __typename?: 'Query';
  _dummy?: Maybe<Scalars['String']['output']>;
  emailinbox?: Maybe<EmailInbox>;
  emailinboxes?: Maybe<Array<Maybe<EmailInbox>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryEmailinboxArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['Int']['output']>;
  birthday?: Maybe<Scalars['String']['output']>;
  cellphone?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  fatherName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Gender>;
  id?: Maybe<Scalars['ID']['output']>;
  motherName?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<Scalars['String']['output']>;
  timezone?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type CreateEmailMutationVariables = Exact<{
  input: CreateEmailInput;
}>;


export type CreateEmailMutation = { __typename?: 'Mutation', createEmail: { __typename?: 'EmailInbox', id?: string | null, userId?: string | null, to?: string | null, cc?: string | null, bcc?: string | null, preview?: string | null, inboxType?: number | null, isRead?: boolean | null, hasAttachment?: boolean | null, importance?: number | null, textBody?: string | null, htmlBody?: string | null, folder?: number | null, createdAt?: string | null } };


export const CreateEmailDocument = { "kind": "Document", "definitions": [{ "kind": "OperationDefinition", "operation": "mutation", "name": { "kind": "Name", "value": "CreateEmail" }, "variableDefinitions": [{ "kind": "VariableDefinition", "variable": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } }, "type": { "kind": "NonNullType", "type": { "kind": "NamedType", "name": { "kind": "Name", "value": "CreateEmailInput" } } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "createEmail" }, "arguments": [{ "kind": "Argument", "name": { "kind": "Name", "value": "input" }, "value": { "kind": "Variable", "name": { "kind": "Name", "value": "input" } } }], "selectionSet": { "kind": "SelectionSet", "selections": [{ "kind": "Field", "name": { "kind": "Name", "value": "id" } }, { "kind": "Field", "name": { "kind": "Name", "value": "userId" } }, { "kind": "Field", "name": { "kind": "Name", "value": "to" } }, { "kind": "Field", "name": { "kind": "Name", "value": "cc" } }, { "kind": "Field", "name": { "kind": "Name", "value": "bcc" } }, { "kind": "Field", "name": { "kind": "Name", "value": "preview" } }, { "kind": "Field", "name": { "kind": "Name", "value": "inboxType" } }, { "kind": "Field", "name": { "kind": "Name", "value": "isRead" } }, { "kind": "Field", "name": { "kind": "Name", "value": "hasAttachment" } }, { "kind": "Field", "name": { "kind": "Name", "value": "importance" } }, { "kind": "Field", "name": { "kind": "Name", "value": "textBody" } }, { "kind": "Field", "name": { "kind": "Name", "value": "htmlBody" } }, { "kind": "Field", "name": { "kind": "Name", "value": "folder" } }, { "kind": "Field", "name": { "kind": "Name", "value": "createdAt" } }] } }] } }] } as unknown as DocumentNode<CreateEmailMutation, CreateEmailMutationVariables>;
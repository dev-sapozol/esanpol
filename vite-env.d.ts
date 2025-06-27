
interface ImportMetaEnv {
  readonly VITE_GRAPHQL_API_URL: string
  readonly VITE_POST_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.graphql' {
  const content: string;
  export default content;
}


declare module "country-list" {
  export function getData(): { code: string; name: string }[]
  export function getCode(name: string): string | undefined
  export function getName(code: string): string | undefined
}
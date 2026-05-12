export type Project = {
  name: string;
  url: string;
  healthEndpoint: string;
}

export const PROJECTS: Project[] = [
  {
    name: "Esanpol",
    url: "/auth/",
    healthEndpoint: `${import.meta.env.VITE_API_URL}/health`
  }
]
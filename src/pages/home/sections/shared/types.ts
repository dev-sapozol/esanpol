export type Project = {
  id: number;
  name: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  featured?: boolean;
  logo?: string;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  period: string;
  description: string | string[];
  tech: string[];
};
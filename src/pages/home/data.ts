import logo from "../../assets/images/LogoSPL.webp";

export const profile = {
  name: "Sebastian Pozo",
  title: "Full Stack Developer",
  description:
    "Full Stack developer, focused on building scalable systems, database modeling, process automation, and AWS cloud integrations. Experienced in handling complex data flows and asynchronous processes. Strong ability to solve technical challenges and deliver efficient, scalable solutions..",
  github: "https://github.com/dev-sapozol",
  linkedin: "https://www.linkedin.com/in/sebastianpozolucano",
  email: "sebastian.pozol14@gmail.com",
};

export const experiences = [
  {
    id: 1,
    company: "Stefanini Solutions // BBVA",
    role: "Backend Java Developer",
    period: "2025",
    description: ["Improved batch processes and internal messaging systems to enhance availability and response times", "Supported environment access management for deployments and testing", " Developed unit and integration tests for APX (online and batch) transactions and libraries"],
    tech: ["Java", "Oracle", "APX"],
  },
  {
    id: 2,
    company: "Fractalup",
    role: "Backend Elixir Developer",
    period: "2024 – 2025",
    description: ["Optimized cloud-based automation processes for scheduled execution", "Implemented data management and exchange for productivity software", "Built query systems for analytical data extraction and reporting", "Designed efficient relational data architectures aligned with project goals"],
    tech: ["Elixir", "Phoenix", "MySQL", "AWS", "Python", "GraphQL"],
  },
];

export const projects = [
  {
    id: 1,
    name: "SPL",
    description:
      "Email client built with Phoenix, AWS SES/SQS, Redis Cache, GraphQL, R2 and WebSockets.",
    tech: [
      "Elixir",
      "Phoenix",
      "AWS [SES, SQS, SNS]",
      "Redis Cache",
      "GraphQL",
      "WebSockets",
      "Cloudflare R2",
      "PostgreSQL",
    ],
    github: "https://github.com/dev-sapozol/spl",
    featured: true,
  },
  {
    id: 2,
    name: "Esanpol",
    logo: logo,
    description: "Mailbox with Vite, React, WebSockets, GraphQL, Module CSS.",
    tech: ["React", "Vite", "GraphQL", "WebSockets", "Module CSS"],
    github: "https://github.com/dev-sapozol/esanpol",
    live: `${import.meta.env.VITE_URL_MAIL}/auth/`,
    code: `${import.meta.env.VITE_REGISTER_CODE}`,
    featured: true,
  },
];

export const technologies = {
  Languages: ["Elixir", "Python", "Java", "Typescript"],
  Frameworks: ["Phoenix", "Vite"],
  Databases: ["MySQL", "Redis", "PostgreSQL", "Oracle"],
  Cloud: ["AWS SES", "AWS SQS", "AWS SNS", "Cloudflare R2"],
  Other: ["React", "WebSockets", "Module CSS", "GraphQL"],
};

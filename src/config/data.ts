import { FaAws, FaDatabase, FaDocker, FaGitAlt, FaLinux, FaPython } from "react-icons/fa";
import {
  SiKubernetes,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPostgresql,
  SiMysql,
  SiSnowflake,
  SiOracle,
  SiTerraform,
  SiAnsible,
  SiJenkins,
  SiGithubactions,
} from "react-icons/si";

export const socialLinks = [
  {
    id: 5,
    priority: 1,
    title: "GitHub",
    url: "https://github.com/kartikeytripathi",
  },
  {
    id: 6,
    priority: 2,
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/kartikeytripathi",
  },
  {
    id: 8,
    priority: 4,
    title: "Instagram",
    url: "https://www.instagram.com/kar.ti.key",
  },
  {
    id: 9,
    priority: 5,
    title: "Diagrams",
    url: "https://diagrams.kartikeytripathi.in",
  },
];

export const personalInfo = {
  name: "Kartikey Tripathi",
  title: "Cloud & DevOps Engineer",
  avatar: "/images/about/KT.JPG",
  email: "kartikey.tripathi.37@gmail.com",
  location: "Hyderabad, Telangana, India",
  description:
    "Cloud and DevOps Engineer with 6.5+ years of experience in AWS, containerization, and cloud-native architectures. Passionate about automation, performance tuning, and helping organizations modernize with EKS, ECS, and microservices.",
};

export const heroSection = {
  personalInfo: personalInfo,
  socialLinks: socialLinks,
};

export const workExperience = [
  {
    company: "Amazon Web Services (AWS)",
    position: "Cloud Engineer – Containers",
    period: "Feb 2026 – Present",
    location: "Hyderabad, Telangana, India",
    shortDesc:
      "Working with enterprise customers on containerized workloads, helping them design and operate scalable cloud-native architectures on AWS.",
    bulletPoints: [
      "Support enterprise customers running production workloads on Amazon EKS, ECS, and ECR",
      "Troubleshoot and resolve complex Kubernetes and container orchestration issues in production environments",
      "Guide customers through container migration strategies and best-practice architecture reviews",
      "Collaborate with internal service teams to escalate and resolve platform-level issues",
    ],
  },
  {
    company: "Amazon Web Services (AWS)",
    position: "Cloud Database Engineer",
    period: "Jun 2024 – Feb 2026",
    location: "Bangalore, Karnataka, India",
    shortDesc:
      "Provided technical support and guidance to enterprise customers on AWS managed database services, ensuring high availability and performance.",
    bulletPoints: [
      "Supported customers on RDS (MySQL, PostgreSQL, Oracle, SQL Server), Aurora, and DMS across complex production setups",
      "Diagnosed and resolved critical database incidents including replication failures, performance degradation, and connectivity issues",
      "Authored and published an AWS Knowledge Center article and YouTube video on securely connecting to private RDS instances via EC2 Instance Connect Endpoint",
      "Collaborated with AWS service teams to identify and escalate product bugs and feature gaps",
      "Helped customers design migration paths from on-premises databases to AWS managed services",
    ],
  },
  {
    company: "IQVIA",
    position: "Software Developer",
    period: "Nov 2021 – Jun 2024",
    location: "Bangalore, Karnataka, India",
    shortDesc:
      "Built and maintained data platform solutions for healthcare and life sciences customers, focusing on data pipelines, warehousing, and governance.",
    bulletPoints: [
      "Developed and optimized data pipelines and ETL workflows using Snowflake, SQL, and cloud-based tools",
      "Contributed to data warehousing and migration projects, improving data reliability and query performance",
      "Implemented data governance practices to ensure compliance with healthcare data standards",
      "Collaborated with cross-functional teams to translate business requirements into scalable data solutions",
      "Maintained and tuned relational databases including Oracle and SQL Server for large-scale analytical workloads",
    ],
  },
  {
    company: "Wipro",
    position: "SQL Database Administrator",
    period: "Jul 2019 – Nov 2021",
    location: "Bangalore, Karnataka, India",
    shortDesc:
      "Administered and maintained SQL Server environments for enterprise clients, ensuring uptime, performance, and data integrity.",
    bulletPoints: [
      "Managed SQL Server instances including installation, configuration, patching, and upgrades",
      "Monitored database performance and implemented tuning strategies to reduce query latency",
      "Designed and maintained backup and recovery procedures to meet RPO and RTO requirements",
      "Supported database migrations and schema changes across dev, staging, and production environments",
      "Worked with application teams to resolve database-level issues and optimize stored procedures",
    ],
  },
];

export const techStack = [
  // === CLOUD & CONTAINERS ===
  { name: "AWS", icon: FaAws, color: "text-orange-400", type: "Cloud & Containers" },
  { name: "Kubernetes", icon: SiKubernetes, color: "text-blue-500", type: "Cloud & Containers" },
  { name: "Docker", icon: FaDocker, color: "text-blue-400", type: "Cloud & Containers" },

  // === DATABASES ===
  { name: "MySQL", icon: SiMysql, color: "text-blue-400", type: "Databases" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-blue-500", type: "Databases" },
  { name: "SQL Server", icon: FaDatabase, color: "text-red-400", type: "Databases" },
  { name: "Oracle", icon: SiOracle, color: "text-red-600", type: "Databases" },
  { name: "Snowflake", icon: SiSnowflake, color: "text-cyan-400", type: "Databases" },

  // === LANGUAGES ===
  { name: "Python", icon: FaPython, color: "text-yellow-400", type: "Languages" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-500", type: "Languages" },

  // === DEVOPS & IAC ===
  { name: "Terraform", icon: SiTerraform, color: "text-purple-500", type: "DevOps & IaC" },
  { name: "Ansible", icon: SiAnsible, color: "text-red-500", type: "DevOps & IaC" },
  { name: "Jenkins", icon: SiJenkins, color: "text-red-400", type: "DevOps & IaC" },
  { name: "GitHub Actions", icon: SiGithubactions, color: "text-white", type: "DevOps & IaC" },
  { name: "Git", icon: FaGitAlt, color: "text-orange-500", type: "DevOps & IaC" },
  { name: "Linux", icon: FaLinux, color: "text-yellow-300", type: "DevOps & IaC" },

  // === WEB ===
  { name: "Next.js", icon: SiNextdotjs, color: "text-white", type: "Web" },
  { name: "Tailwind", icon: SiTailwindcss, color: "text-cyan-400", type: "Web" },
];

export const projects = [
  {
    title: "KubeForge",
    description:
      "Hands-on Kubernetes & Amazon EKS learning platform with 38 labs across 4 phases — from core K8s concepts to production EKS deep dives. Every concept ships with a lab and every lab has automated verification, targeting engineers pursuing CKA or moving into DevOps.",
    image: "/images/projects/kubeforge.webp",
    liveUrl: "https://kubeforge.kartikeytripathi.in",
    githubUrl: "https://github.com/kartikeytripathi/kubeforge",
    techStack: techStack.filter((item) =>
      ["Next.js", "TypeScript", "Tailwind"].includes(item.name)
    ),
  },
];

export const certifications = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services (AWS)",
    issued: "2024",
    expires: "",
    url: "",
  },
  {
    title: "AWS Certified AI Practitioner",
    issuer: "Amazon Web Services (AWS)",
    issued: "Oct 2024",
    expires: "Oct 2027",
    url: "",
  },
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services (AWS)",
    issued: "2022",
    expires: "",
    url: "",
  },
  {
    title: "Foundations of AI Agents",
    issuer: "Become a Solutions Architect (BeSA)",
    issued: "Feb 2026",
    expires: "",
    url: "",
  },
  {
    title: "Oracle Cloud Infrastructure 2023 Certified Foundations Associate",
    issuer: "Oracle",
    issued: "2023",
    expires: "",
    url: "",
  },
  {
    title: "Amazon DynamoDB Immersion Day Participant",
    issuer: "Amazon Web Services (AWS)",
    issued: "2023",
    expires: "",
    url: "",
  },
];

export const githubSection = {
  username: "kartikeytripathi",
  title: "GitHub Contributions",
};

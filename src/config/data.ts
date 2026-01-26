import { FaReact, FaNodeJs, FaGitAlt, FaDocker } from "react-icons/fa";
import { FiCpu, FiHeadphones, FiMonitor } from "react-icons/fi";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import {
  SiNextdotjs,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiGraphql,
  SiPostgresql,
  SiVercel,
  SiFramer,
  SiPostman,
  SiCloudflare,
  SiMongodb,
  SiRedux,
  SiSupabase,
  SiSass,
  SiSanity,
  SiExpress,
} from "react-icons/si";

export const socialLinks = [
  {
    id: 5,
    priority: 1,
    title: "GitHub",
    url: "https://github.com/adityadomle",
  },
  {
    id: 6,
    priority: 2,
    title: "LinkedIn",
    url: "https://www.linkedin.com/in/adityadomle",
  },
  {
    id: 7,
    priority: 3,
    title: "Twitter",
    url: "https://x.com/env_aditya",
  },
  {
    id: 8,
    priority: 4,
    title: "Instagram",
    url: "https://www.instagram.com/adittya.tsx",
  },
];

export const personalInfo = {
  name: "Aditya Domle",
  title: "Full-Stack Developer | Next.js, React, Node.js",
  avatar: "/images/about/aditya-domle.webp",
  email: "adityadomle14@gmail.com",
  location: "Ngp, Maharashtra, India",
  description:
    "Self-taught Full-Stack Developer from India, specializing in modern web technologies and open-source development. Passionate about building scalable applications with Next.js and contributing to the developer community through open-source projects.",
};

export const heroSection = {
  personalInfo: personalInfo,
  socialLinks: socialLinks,
};

export const workExperience = [
  {
    company: "GSSoC'25",
    position: "Project Admin/Maintainer",
    period: "Aug 2025 - Sept 2025",
    shortDesc:
      "As a Project Admin, I reviewed code, merged pull requests, and communicated with developers, ensuring smooth project workflow and collaboration during GSSoC'25. My full responsibilities included:",
    bulletPoints: [
      "Reviewed code submissions and resolved technical blockers to maintain project quality",
      "Collaborated with fellow open-source developers on project planning and implementation",
      "Designed and implemented UI/UX solutions with modern animation libraries like Framer Motion and GSAP",
      "Managed API integrations and ensured smooth communication across the development team",
      "Mentored contributors and facilitated knowledge sharing within the community",
      "Coordinated pull request reviews and maintained high code quality standards",
    ],
  },
  {
    company: "Sheryians Coding School",
    position: "Trainee",
    period: "May 2025 - Oct 2025",
    shortDesc:
      "Trainee at Sheryians Coding School, where I learned full-stack technologies and DevOps practices. Participated in hackathons and collaborated on projects with the developer community. My learning journey included:",
    bulletPoints: [
      "Mastered modern full-stack development with MERN stack and Next.js",
      "Gained hands-on experience with AI technologies including RAG, LLMs, and LangChain",
      "Built projects publicly and collaborated on innovative ideas with peers",
      "Participated in hackathons and coding challenges to sharpen problem-solving skills",
      "Learned industry-standard practices and modern development workflows",
      "Explored DevOps practices and cloud deployment strategies",
    ],
  },
];

export const techStack = [
  // === FRONTEND ===
  {
    name: "JavaScript",
    icon: SiJavascript,
    color: "text-yellow-400",
    type: "Frontend",
  },
  {
    name: "TypeScript",
    icon: SiTypescript,
    color: "text-blue-500",
    type: "Frontend",
  },
  {
    name: "Tailwind",
    icon: SiTailwindcss,
    color: "text-cyan-400",
    type: "Frontend",
  },
  {
    name: "SCSS",
    icon: SiSass,
    color: "text-pink-600",
    type: "Frontend",
  },
  {
    name: "Framer",
    icon: SiFramer,
    color: "text-pink-500",
    type: "Frontend",
  },
  { name: "React", icon: FaReact, color: "text-blue-400", type: "Frontend" },
  {
    name: "Redux",
    icon: SiRedux,
    color: "text-purple-700",
    type: "Frontend",
  },
  { name: "Next.js", icon: SiNextdotjs, color: "text-white", type: "Frontend" },

  // === BACKEND & DATABASES ===
  {
    name: "Node.js",
    icon: FaNodeJs,
    color: "text-green-500",
    type: "Backend & Databases",
  },
  {
    name: "Express",
    icon: SiExpress,
    color: "text-gray-500",
    type: "Backend & Databases",
  },
  {
    name: "MongoDB",
    icon: SiMongodb,
    color: "text-green-600",
    type: "Backend & Databases",
  },
  {
    name: "Supabase",
    icon: SiSupabase,
    color: "text-green-400",
    type: "Backend & Databases",
  },

  // === CMS ===
  {
    name: "Sanity",
    icon: SiSanity,
    color: "text-red-500",
    type: "CMS",
  },

  // === TOOLS & DEVOPS ===
  {
    name: "Docker",
    icon: FaDocker,
    color: "text-blue-500",
    type: "Tools & DevOps",
  },
  {
    name: "Vercel",
    icon: SiVercel,
    color: "text-white",
    type: "Tools & DevOps",
  },
  {
    name: "Git",
    icon: FaGitAlt,
    color: "text-orange-500",
    type: "Tools & DevOps",
  },
  {
    name: "Postman",
    icon: SiPostman,
    color: "text-orange-600",
    type: "Tools & DevOps",
  },
  {
    name: "Cloudflare",
    icon: SiCloudflare,
    color: "text-orange-400",
    type: "Tools & DevOps",
  },
];

export const projects = [
  {
    title: "ResearchX",
    description:
      "AI-powered research document generator that creates comprehensive research papers using advanced AI models. Features customizable outlines, multiple export formats (DOCX, PDF), and light/dark mode support for students, researchers, and professionals.",
    image: "/images/projects/researchx.webp",
    liveUrl: "https://research2.vercel.app/",
    githubUrl: "https://github.com/adityadomle/ResearchX",
    techStack: techStack.filter((item) =>
      ["Next.js", "TypeScript", "Tailwind"].includes(item.name)
    ),
  },
  {
    title: "Freshmart Store",
    description:
      "Modern grocery store web application with a clean and responsive UI. Built with efficient state management using Redux, featuring smooth routing and optimized performance for seamless shopping experience.",
    image: "/images/projects/freshmart.webp",
    liveUrl: "https://freshmart-store.vercel.app",
    githubUrl: "https://github.com/adityadomle/freshmart-store",
    techStack: techStack.filter((item) =>
      ["React", "Redux", "Tailwind"].includes(item.name)
    ),
  },
  {
    title: "Nike Reimagined",
    description:
      "A sleek and modern Nike website redesign showcasing fully responsive design with smooth animations and clean UI inspired by Nike's iconic branding. Built with mobile-first approach and deployed on Vercel for lightning-fast performance.",
    image: "/images/projects/nike-reimagined.webp",
    liveUrl: "https://nike-reimagined-mu.vercel.app/",
    githubUrl: "https://github.com/adityadomle/nike-reimagined",
    techStack: techStack.filter((item) =>
      ["React", "Tailwind"].includes(item.name)
    ),
  },
  {
    title: "News Hub",
    description:
      "Real-time news application integrating News API to deliver headlines across various categories. Features a modern interface with TypeScript for type safety and shadcn-ui components for a polished user experience.",
    image: "/images/projects/news-hub.webp",
    liveUrl: "https://news-hub-seven-chi.vercel.app/",
    githubUrl: "https://github.com/adityadomle/news-hub",
    techStack: techStack.filter((item) =>
      ["React", "TypeScript", "Tailwind"].includes(item.name)
    ),
  },
];

export const certifications = [
  {
    title: "Full Stack + DevOps",
    image: "/images/certifications/cert1.webp",
    url: "/images/certifications/cert1.webp",
  },
  {
    title: "JavaScript (HackerRank)",
    image: "/images/certifications/cert2.webp",
    url: "https://www.hackerrank.com/certificates/bd2d5b312338",
  },
  {
    title: "React (HackerRank)",
    image: "/images/certifications/cert3.webp",
    url: "https://www.hackerrank.com/certificates/b3100e423bf5",
  },
  {
    title: "JavaScript (Udemy)",
    image: "/images/certifications/cert4.webp",
    url: "https://www.udemy.com/certificate/UC-d2bcd2a3-c3de-42d5-8a71-826432170ce1/",
  },
  // Add more certifications here
];

export const githubSection = {
  username: "adityadomle",
  title: "GitHub Contributions",
};

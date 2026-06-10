export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  type: "video" | "article" | "resource";
  videoId?: string;
  externalUrl?: string;
  thumbnail: string;
  publishedOn?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "adot-collector-eks-setup",
    title: "Installing the ADOT Collector on EKS: Every Trap I Hit, and How I Got Out",
    description:
      "A start-to-finish walkthrough of installing the AWS Distro for OpenTelemetry addon on EKS — cert-manager prereqs, the v1beta1 config gotcha, pod-density scheduling failures, and verifying traces actually land in X-Ray.",
    date: "Jun 2026",
    tags: ["AWS", "EKS", "ADOT", "OpenTelemetry", "Observability", "X-Ray", "Kubernetes"],
    type: "article",
    thumbnail: "/images/blog/adot-hero.webp",
  },
  {
    slug: "conntrack-kubernetes-dns-race",
    title: "The conntrack DNS Race Condition in Kubernetes",
    description:
      "Why your pods get random 5-second DNS timeouts — a deep dive into the Linux conntrack table, the A vs AAAA query race through iptables SNAT, how to confirm it with conntrack -S, and four remediation paths including NodeLocal DNSCache.",
    date: "Jun 2026",
    tags: ["Kubernetes", "Networking", "DNS", "conntrack", "iptables", "EKS", "Debugging", "DevOps"],
    type: "article",
    thumbnail: "/images/blog/conntrack-dns-race-thumbnail.svg",
  },
  {
    slug: "networking-handbook",
    title: "Networking // Field Manual",
    description:
      "Five modules, one mantra. Move from packets on a wire to VPCs in the cloud, with a debugging arsenal in between. An interactive, offline-ready reference built for DevOps and cloud engineers.",
    date: "May 2026",
    tags: ["Networking", "DevOps", "Cloud", "Reference"],
    type: "resource",
    externalUrl: "https://blogs.kartikeytripathi.in/resources/networking-handbook",
    thumbnail: "",
  },
  {
    slug: "how-traffic-reaches-your-eks-pods",
    title: "What Actually Happens When Internet Traffic Reaches Your EKS Pod",
    description:
      "From Ingress YAML to a packet landing on your container — a full walkthrough of the AWS Load Balancer Controller, TargetGroupBinding, EndpointSlices, and the ready vs serving conditions that make rolling updates graceful.",
    date: "May 2026",
    tags: ["AWS", "EKS", "Kubernetes", "Networking", "ALB", "Ingress", "DevOps"],
    type: "article",
    thumbnail: "",
  },
  {
    slug: "how-irsa-really-works-on-eks",
    title: "How IRSA Really Works on EKS — and the One-Character Bug That Can Break It",
    description:
      "A deep dive into IAM Roles for Service Accounts on Amazon EKS — how the JWT-to-IAM-credentials exchange actually works, what STS checks under the hood, and why a single stray character in your OIDC provider configuration can silently break everything.",
    date: "May 2026",
    tags: ["AWS", "EKS", "Kubernetes", "IRSA", "OIDC", "STS", "Debugging"],
    type: "article",
    thumbnail: "",
  },
  {
    slug: "what-happens-when-you-run-kubectl-apply",
    title: "What Actually Happens When You Run kubectl apply",
    description:
      "A walkthrough of every component your YAML touches — from your terminal to the running container. AuthN, admission, etcd, controllers, scheduler, kubelet, CNI, and beyond.",
    date: "May 2026",
    tags: ["Kubernetes", "EKS", "kubectl", "Internals", "DevOps"],
    type: "article",
    thumbnail: "",
  },
  {
    slug: "connect-rds-private-ec2-instance-connect-endpoint",
    title:
      "How do I use an EC2 instance to connect to a private RDS DB instance from a local machine?",
    description:
      "A step-by-step walkthrough on securely connecting to a private Amazon RDS instance from your local machine using EC2 Instance Connect Endpoint — no bastion host or SSH tunnel required.",
    date: "Oct 2025",
    tags: ["AWS", "RDS", "EC2", "Networking"],
    type: "video",
    videoId: "TRkp54ekyY4",
    externalUrl: "https://www.youtube.com/watch?v=TRkp54ekyY4",
    thumbnail: "https://i.ytimg.com/vi/TRkp54ekyY4/hqdefault.jpg",
    publishedOn: "Amazon Web Services",
  },
];

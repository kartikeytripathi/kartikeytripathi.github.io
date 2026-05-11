export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  type: "video" | "article";
  videoId?: string;
  thumbnail: string;
  publishedOn?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "connect-rds-private-ec2-instance-connect-endpoint",
    title:
      "How do I use an EC2 instance to connect to a private RDS DB instance from a local machine?",
    description:
      "A step-by-step walkthrough on securely connecting to a private Amazon RDS instance from your local machine using EC2 Instance Connect Endpoint — no bastion host or SSH tunnel required.",
    date: "Oct 2024",
    tags: ["AWS", "RDS", "EC2", "Networking"],
    type: "video",
    videoId: "TRkp54ekyY4",
    thumbnail: "https://i.ytimg.com/vi/TRkp54ekyY4/hqdefault.jpg",
    publishedOn: "Amazon Web Services",
  },
];

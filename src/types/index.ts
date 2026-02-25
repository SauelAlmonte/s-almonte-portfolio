export interface Project {
  _id?: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Skill {
  _id?: string;
  name: string;
  category: SkillCategory;
  proficiency: number; // 1–100
  iconUrl?: string;
  order: number;
}

export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "design"
  | "other";

export interface Resume {
  _id?: string;
  fileUrl: string;
  version: string;
  isActive: boolean;
  updatedAt?: Date;
}

export interface NavItem {
  label: string;
  href: string;
}

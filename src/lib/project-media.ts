import { PortfolioProject } from "@/components/projects/project-card";

export function getProjectImage(project?: PortfolioProject | null) {
  if (!project) return "/images/optimized/4.webp";
  const firstImg = project.images?.[0];
  if (typeof firstImg === "string" && firstImg) return firstImg;
  if (firstImg && typeof firstImg === "object" && firstImg.url) return firstImg.url;
  return project.logoUrl || "/images/optimized/4.webp";
}

export function getProjectYear(project?: PortfolioProject | null) {
  if (!project) return null;
  if (project.year) return String(project.year);
  if (project.completionDate) {
    return String(new Date(project.completionDate).getFullYear());
  }
  return null;
}

export function getProjectSummary(project?: PortfolioProject | null) {
  if (!project) return "";
  return project.overviewDescription || project.description || "";
}

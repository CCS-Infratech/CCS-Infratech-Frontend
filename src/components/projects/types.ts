export interface ProjectImageRef {
  url?: string;
  alt?: string | null;
  caption?: string | null;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug?: string;
  category?: string;
  location?: string | null;
  year?: string | number | null;
  completionDate?: string | null;
  description?: string | null;
  overviewDescription?: string | null;
  featured?: boolean;
  status?: string;
  logoUrl?: string | null;
  images?: Array<string | ProjectImageRef>;
  group?: { name?: string; slug?: string } | null;
}

export interface ProjectGroupSummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  coverImageUrl?: string | null;
  projects?: PortfolioProject[];
  _count?: { projects?: number };
}

export const PROJECT_FALLBACK_IMAGE = "/images/4.avif";

/** First usable image for a project, falling back to its logo then a stock shot. */
export function getProjectImage(
  project?: PortfolioProject | null,
  index = 0,
): string {
  if (!project) return PROJECT_FALLBACK_IMAGE;
  const img = project.images?.[index] ?? project.images?.[0];
  if (typeof img === "string" && img) return img;
  if (img && typeof img === "object" && img.url) return img.url;
  return project.logoUrl || PROJECT_FALLBACK_IMAGE;
}

/** Completion year as a string, or null when the project has no date. */
export function getProjectYear(project?: PortfolioProject | null): string | null {
  if (!project) return null;
  if (project.year) return String(project.year);
  if (project.completionDate) {
    const year = new Date(project.completionDate).getFullYear();
    if (!Number.isNaN(year)) return String(year);
  }
  return null;
}

export function isCompleted(project?: PortfolioProject | null): boolean {
  return project?.status === "COMPLETED";
}

export function getStatusLabel(status?: string | null): string {
  if (!status) return "";
  return status === "COMPLETED" ? "Completed" : "Under construction";
}

const PROJECT_EXTERNAL_URLS: Record<string, string> = {
  "ccs-cricket-academy": "https://www.ccsacademylucknow.com/",
};

export function getProjectHref(project: PortfolioProject): string {
  const slug = project.slug || project.id;

  return PROJECT_EXTERNAL_URLS[slug] || `/projects/${slug}`;
}

export function getProjectSummary(project?: PortfolioProject | null): string {
  if (!project) return "";
  return project.overviewDescription || project.description || "";
}

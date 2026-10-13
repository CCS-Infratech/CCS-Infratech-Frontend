import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = "https://ccsinfratech.com";
const BACKEND_URL =
  process.env.CCS_BACKEND_URL || "http://127.0.0.1:8000";

type Project = {
  id: string;
  slug?: string;
  published?: boolean;
};

type ProjectGroup = {
  id: string;
  slug: string;
};

type Blog = {
  id: string;
  slug?: string;
  published?: boolean;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
};

async function getPublishedProjects(): Promise<Project[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/projects/published?page=1&limit=100`,
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const json = (await response.json()) as ApiResponse<Project[]>;

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Sitemap project fetch failed:", error);
    return [];
  }
}

async function getPublishedProjectGroups(): Promise<ProjectGroup[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/project-groups/published`,
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const json = (await response.json()) as ApiResponse<ProjectGroup[]>;

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Sitemap project-group fetch failed:", error);
    return [];
  }
}

async function getPublishedBlogs(): Promise<Blog[]> {
  try {
    const response = await fetch(
      `${BACKEND_URL}/api/v1/blog/published`,
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const json = (await response.json()) as ApiResponse<Blog[]>;

    return Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Sitemap blog fetch failed:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, groups, blogs] = await Promise.all([
    getPublishedProjects(),
    getPublishedProjectGroups(),
    getPublishedBlogs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "/",
    "/about-us",
    "/projects",
    "/contact-us",
    "/blogs",
    "/media/press-coverage",
    "/media/events-and-campaigns",
    "/media/walkthrough",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const groupRoutes: MetadataRoute.Sitemap = groups
    .filter((group) => group.slug)
    .map((group) => ({
      url: `${SITE_URL}/projects/groups/${group.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((project) => project.slug || project.id)
    .map((project) => ({
      url: `${SITE_URL}/projects/${project.slug || project.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const blogRoutes: MetadataRoute.Sitemap = blogs
    .filter((blog) => blog.id && blog.published !== false)
    .map((blog) => ({
      // Blog detail currently resolves by ID.
      url: `${SITE_URL}/blogs/${blog.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [
    ...staticRoutes,
    ...groupRoutes,
    ...projectRoutes,
    ...blogRoutes,
  ];
}

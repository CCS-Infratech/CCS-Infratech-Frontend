"use client";

import { useState, useEffect, useRef, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  User,
} from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { blogService } from "@/http/blogs";

// Define interface for Blog and related data types
interface Author {
  id: string;
  username: string;
  email: string;
  image?: string;
}

interface BlogImage {
  id: string;
  url: string;
  blogId: string;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  published: boolean;
  publishedAt: string | null;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  author: Author;
  images: BlogImage[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Blog;
}

// Updated to fetch by ID instead of slug
const fetchBlogById = async (id: string): Promise<ApiResponse> => {
  console.log(`Attempting to fetch blog with ID: ${id}`);

  try {
    const response = await blogService.getBlog(id);
    console.log("API response:", response);

    if (response.success && response.data) {
      return response;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    throw error;
  }
};

export default function BlogPostPage(): JSX.Element {
  const params = useParams();
  const pathname = usePathname();

  // Extract blog ID from URL params or pathname
  let blogId = "";

  if (typeof params.id === "string") {
    blogId = params.id;
  } else if (Array.isArray(params.id) && params.id.length > 0) {
    blogId = params.id[0];
  } else if (pathname) {
    const segments = pathname.split("/");
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    for (const segment of segments) {
      if (uuidPattern.test(segment)) {
        blogId = segment;
        break;
      }
    }
  }

  console.log("Blog ID extracted from URL:", blogId);

  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const getShareUrl = () => {
    if (typeof window === "undefined") {
      return "";
    }

    return window.location.href;
  };

  const getShareTitle = () => {
    return blog?.title || "CCS Infratech";
  };

  const shareToFacebook = () => {
    const url = getShareUrl();

    if (!url) return;

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
      "_blank",
      "noopener,noreferrer,width=700,height=600"
    );
  };

  const shareToTwitter = () => {
    const url = getShareUrl();
    const title = getShareTitle();

    if (!url) return;

    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      "_blank",
      "noopener,noreferrer,width=700,height=600"
    );
  };

  const shareToLinkedIn = () => {
    const url = getShareUrl();

    if (!url) return;

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        url
      )}`,
      "_blank",
      "noopener,noreferrer,width=700,height=600"
    );
  };

  const shareArticle = async () => {
    const url = getShareUrl();

    if (!url) return;

    const title = getShareTitle();

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: blog?.summary || title,
          url,
        });

        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        return;
      }

      window.prompt("Copy this link:", url);
    } catch (error) {
      console.log("Share cancelled:", error);
    }
  };



  // ✅ FIX: Add hydration state to prevent useScroll error
  const [isHydrated, setIsHydrated] = useState(false);

  // Ref attached to the article section to track scroll progress
  const articleRef = useRef<HTMLElement>(null);

  // ✅ FIX: Set hydrated state after component mounts
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // ✅ FIX: Conditionally use useScroll only when hydrated
  const { scrollYProgress } = useScroll(
    isHydrated && articleRef.current
      ? {
          target: articleRef,
          offset: ["start start", "end start"],
        }
      : undefined
  );

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Blog fetch function using ID
  useEffect(() => {
    const fetchBlogData = async (): Promise<void> => {
      if (!blogId) {
        setError("No blog ID provided");
        setIsLoading(false);
        return;
      }

      console.log("Fetching blog with ID:", blogId);

      try {
        setIsLoading(true);
        const response = await fetchBlogById(blogId);

        if (response.success && response.data) {
          if (!response.data.content) {
            console.warn("Blog content is empty or null");
            response.data.content = "<p>This blog post has no content yet.</p>";
          }

          setBlog(response.data);
        } else {
          setError("Failed to load blog post. Please try again later.");
        }
      } catch (err) {
        console.error("Error in main fetch function:", err);
        setError(
          `Failed to load blog post: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId]);

  // Fetch related blog posts
  useEffect(() => {
    const fetchRelatedBlogs = async (): Promise<void> => {
      if (!blog) return;

      try {
        const response = await blogService.getBlogs();

        if (response.success && response.data) {
          const related = response.data
            .filter((relatedBlog: any) => relatedBlog.id !== blog.id)
            .slice(0, 3);

          setRelatedBlogs(related);
        }
      } catch (err) {
        console.error("Error fetching related blogs:", err);
      }
    };

    fetchRelatedBlogs();
  }, [blog]);

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <Wrapper className="max-w-4xl mx-auto px-4">
          {/* Header skeleton */}
          <div className="pt-12 pb-8">
            <div className="flex items-center mb-6">
              <div className="bg-gray-200 h-6 w-32 rounded animate-pulse"></div>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-gray-200 h-12 w-full md:w-3/4 rounded animate-pulse mb-4"></div>
              <div className="bg-gray-200 h-12 w-5/6 md:w-2/3 rounded animate-pulse mb-8"></div>

              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="bg-gray-200 h-6 w-24 rounded animate-pulse"></div>
                <div className="bg-gray-200 h-6 w-24 rounded animate-pulse"></div>
                <div className="bg-gray-200 h-6 w-24 rounded animate-pulse"></div>
              </div>

              <div className="flex items-center mb-10">
                <div className="bg-gray-200 h-12 w-12 rounded-full animate-pulse mr-4"></div>
                <div>
                  <div className="bg-gray-200 h-5 w-32 rounded animate-pulse mb-2"></div>
                  <div className="bg-gray-200 h-4 w-40 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Article content skeleton */}
          <div className="py-12 border-b border-gray-100">
            <div className="space-y-6 mb-12">
              <div className="bg-gray-200 h-7 w-full rounded animate-pulse"></div>
              <div className="bg-gray-200 h-4 w-full rounded animate-pulse"></div>
              <div className="bg-gray-200 h-4 w-full rounded animate-pulse"></div>
              <div className="bg-gray-200 h-4 w-5/6 rounded animate-pulse"></div>
              <div className="bg-gray-200 h-48 w-full rounded animate-pulse my-8"></div>
              <div className="bg-gray-200 h-7 w-full rounded animate-pulse"></div>
              <div className="bg-gray-200 h-4 w-full rounded animate-pulse"></div>
              <div className="bg-gray-200 h-4 w-3/4 rounded animate-pulse"></div>
            </div>
          </div>
        </Wrapper>
      </div>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="text-amber-500 text-5xl mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "Blog post not found."}
          </p>
          <div className="mb-6 p-4 bg-gray-100 rounded-md text-left">
            <p className="text-sm text-gray-700 mb-2">Debug information:</p>
            <p className="text-sm text-gray-700 mb-1">Blog ID: {blogId}</p>
            <p className="text-sm text-gray-700 mb-1">Pathname: {pathname}</p>
            <p className="text-sm text-gray-700">
              Params: {JSON.stringify(params)}
            </p>
          </div>
          <Link
            href="/blogs"
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
          >
            Return to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const readTime = `${Math.ceil(blog.content?.length / 1000 || 1)} min read`;

  const date = new Date(blog.publishedAt || blog.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Reading Progress Bar - Only render when hydrated */}
      {isHydrated && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-amber-500 z-50 origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      )}

      <Wrapper>
        {/* Hero Section */}
        <header className="pt-12 pb-8 md:pb-12">
          <div className="max-w-3xl mx-auto px-4">
            <motion.div
              className="mt-8 md:mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link
                href="/blogs"
                className="inline-flex items-center text-gray-500 hover:text-amber-600 mb-8 text-sm font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to all articles
              </Link>

              {/* Title - Medium Style */}
              <motion.h1
                className="text-3xl md:text-[42px] lg:text-[46px] font-bold text-gray-900 mb-6 leading-[1.15] tracking-tight "
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                {blog.title}
              </motion.h1>

              {/* Summary/Subtitle - Medium Style */}
              {blog.summary && (
                <motion.p
                  className="text-xl md:text-2xl text-gray-500 mb-8 leading-relaxed "
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {blog.summary}
                </motion.p>
              )}

              {/* Author & Meta - Medium Style */}
              <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-t border-b border-gray-100">
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    {blog.author?.image ? (
                      <Image
                        src={blog.author.image}
                        alt={blog.author.username}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
                        {blog.author?.username?.charAt(0).toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 hover:text-amber-600 cursor-pointer transition-colors">
                      {blog.author?.username || "Anonymous"}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 gap-2">
                      <span>{date}</span>
                      <span>·</span>
                      <span>{readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Share buttons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    type="button"
                    className="p-2 rounded-full text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookmarkPlus size={20} />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={shareArticle}
                    aria-label="Share article"
                    className="p-2 rounded-full text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Featured Image */}
        {blog.images && blog.images.length > 0 && (
          <motion.div
            className="max-w-4xl mx-auto px-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <figure className="relative aspect-video rounded-lg overflow-hidden">
              <Image
                src={blog.images[0].url}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </figure>
          </motion.div>
        )}

        {/* Article Content - REF IS ATTACHED HERE */}
        <article ref={articleRef} className="py-8">
          <div className="max-w-3xl mx-auto px-4">
            {/* ✅ Medium-Style Article Content */}
            <motion.div
              className="article-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              dangerouslySetInnerHTML={{
                __html:
                  blog.content ||
                  "<p>No content available for this article.</p>",
              }}
            />

            {/* Mobile Share Buttons */}
            <div className="flex justify-center space-x-3 mt-12">
              <button
                type="button"
                onClick={shareToFacebook}
                aria-label="Share on Facebook"
                className="p-3 rounded-full bg-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Facebook size={20} />
              </button>

              <button
                type="button"
                onClick={shareToTwitter}
                aria-label="Share on Twitter"
                className="p-3 rounded-full bg-sky-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Twitter size={20} />
              </button>

              <button
                type="button"
                onClick={shareToLinkedIn}
                aria-label="Share on LinkedIn"
                className="p-3 rounded-full bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Linkedin size={20} />
              </button>

              <button
                type="button"
                onClick={shareArticle}
                aria-label="Share article"
                className="p-3 rounded-full bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Tags Section */}
            <motion.div
              className="mt-12 pt-8 border-t border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-wrap gap-2">
                {["Architecture", "Luxury Living", "Design", "Real Estate"].map(
                  (tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </motion.div>

            {/* Claps/Likes Section - Medium Style */}
            <motion.div
              className="mt-8 flex items-center justify-between py-6 border-y border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4">
                <motion.button
                  className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">👏</span>
                  <span className="font-medium">{blog.viewCount || 0}</span>
                </motion.button>
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <MessageCircle size={20} />
                  <span>0</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  className="p-2 rounded-full text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookmarkPlus size={22} />
                </motion.button>
                <motion.button
                  type="button"
                  onClick={shareArticle}
                  aria-label="Share article"
                  className="p-2 rounded-full text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 size={22} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </article>

        {/* Article Navigation */}
        <section className="py-8 border-y border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Link
                href="/blogs"
                className="group flex items-center text-gray-600 hover:text-amber-600 transition-colors"
              >
                <ChevronLeft
                  className="mr-2 transition-transform group-hover:-translate-x-1"
                  size={20}
                />
                <span className="font-medium">Back to Blogs</span>
              </Link>

              <Link
                href="/blogs"
                className="group flex items-center text-gray-600 hover:text-amber-600 justify-end transition-colors"
              >
                <span className="font-medium">View All Blogs</span>
                <ChevronRight
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  size={20}
                />
              </Link>
            </div>
          </div>
        </section>

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <section className="py-16">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 ">
                  More from CCS Infratech
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedBlogs.map((relatedBlog, index) => (
                  <motion.article
                    key={relatedBlog.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      {relatedBlog.images && relatedBlog.images.length > 0 ? (
                        <Image
                          src={relatedBlog.images[0].url}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                          <span className="text-amber-800 text-lg font-medium">
                            CCS Infratech
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {relatedBlog.author?.username
                            ?.charAt(0)
                            .toUpperCase() || "A"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {relatedBlog.author?.username || "Anonymous"}
                      </span>
                    </div>

                    <Link href={`/blogs/${relatedBlog.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
                        {relatedBlog.title}
                      </h3>
                    </Link>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {relatedBlog.summary}
                    </p>

                    <div className="flex items-center text-xs text-gray-400 gap-2">
                      <span>
                        {new Date(relatedBlog.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                      <span>·</span>
                      <span>
                        {Math.ceil(
                          (relatedBlog.content?.length || 1000) / 1000
                        )}{" "}
                        min read
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        <section className="py-16 mb-11 bg-gray-50">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 ">
                Get the best of CCS Infratech
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Subscribe to our newsletter for insights on luxury living and
                architecture
              </p>

              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-5 py-3.5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full transition-colors font-medium whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </Wrapper>

      {/* ✅ Medium-Style CSS for Article Content */}
      <style jsx global>{`
        .article-content {
          font-family: "Georgia", "Times New Roman", serif;
          font-size: 1.25rem;
          line-height: 1.8;
          color: #292929;
        }

        .article-content > *:first-child {
          margin-top: 0;
        }

        /* Paragraphs */
        .article-content p {
          margin-bottom: 1.75rem;
          font-size: 1.25rem;
          line-height: 1.8;
          letter-spacing: -0.003em;
        }

        /* First paragraph - Drop cap effect */
        .article-content > p:first-of-type::first-letter {
          float: left;
          font-size: 4rem;
          line-height: 1;
          font-weight: bold;
          margin-right: 0.75rem;
          margin-top: 0.25rem;
          color: #f59e0b;
        }

        /* Headings */
        .article-content h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          line-height: 1.25;
          color: #191919;
          letter-spacing: -0.02em;
        }

        .article-content h2 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          line-height: 1.3;
          color: #191919;
          letter-spacing: -0.02em;
        }

        .article-content h3 {
          font-size: 1.375rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.4;
          color: #191919;
        }

        .article-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.875rem;
          color: #191919;
        }

        /* Links */
        .article-content a {
          color: #f59e0b;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }

        .article-content a:hover {
          color: #d97706;
        }

        /* Strong/Bold */
        .article-content strong,
        .article-content b {
          font-weight: 700;
          color: #191919;
        }

        /* Italic/Emphasis */
        .article-content em,
        .article-content i {
          font-style: italic;
        }

        /* Blockquotes - Medium Style */
        .article-content blockquote {
          margin: 2.5rem 0;
          padding: 0 0 0 1.5rem;
          border-left: 4px solid #f59e0b;
          font-style: italic;
          font-size: 1.375rem;
          line-height: 1.7;
          color: #4a4a4a;
        }

        .article-content blockquote p {
          margin-bottom: 0;
        }

        /* Pull quotes */
        .article-content .pullquote,
        .article-content blockquote.large {
          margin: 3rem -2rem;
          padding: 2rem;
          border-left: none;
          text-align: center;
          font-size: 1.75rem;
          font-weight: 500;
          color: #292929;
          background: linear-gradient(to right, #fef3c7, #fde68a);
          border-radius: 0.5rem;
        }

        /* Lists */
        .article-content ul,
        .article-content ol {
          margin: 1.75rem 0;
          padding-left: 2rem;
        }

        .article-content ul {
          list-style-type: disc;
        }

        .article-content ol {
          list-style-type: decimal;
        }

        .article-content li {
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
          line-height: 1.7;
        }

        .article-content li::marker {
          color: #f59e0b;
        }

        /* Nested lists */
        .article-content ul ul,
        .article-content ol ol,
        .article-content ul ol,
        .article-content ol ul {
          margin: 0.5rem 0;
        }

        /* Images */
        .article-content img {
          max-width: 100%;
          height: auto;
          margin: 2.5rem auto;
          border-radius: 0.5rem;
          display: block;
        }

        /* Figure with caption */
        .article-content figure {
          margin: 2.5rem -1rem;
        }

        @media (min-width: 768px) {
          .article-content figure {
            margin: 3rem -3rem;
          }
        }

        .article-content figure img {
          margin: 0 auto;
          width: 100%;
        }

        .article-content figcaption {
          text-align: center;
          font-size: 0.9375rem;
          color: #757575;
          margin-top: 1rem;
          font-style: italic;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
        }

        /* Code - Inline */
        .article-content code {
          background-color: #f5f5f5;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: "SF Mono", "Monaco", "Consolas", monospace;
          font-size: 0.9em;
          color: #e83e8c;
        }

        /* Code - Block */
        .article-content pre {
          background-color: #1a1a2e;
          color: #e4e4e7;
          padding: 1.5rem;
          border-radius: 0.75rem;
          overflow-x: auto;
          margin: 2rem 0;
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .article-content pre code {
          background: none;
          padding: 0;
          color: inherit;
          font-size: inherit;
        }

        /* Horizontal Rule */
        .article-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            #d1d5db,
            transparent
          );
          margin: 3rem 0;
        }

        /* Tables */
        .article-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-size: 1rem;
        }

        .article-content th,
        .article-content td {
          padding: 0.875rem 1rem;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }

        .article-content th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #191919;
        }

        .article-content tr:hover {
          background-color: #fef3c7;
        }

        /* Highlight/Mark */
        .article-content mark {
          background: linear-gradient(to bottom, #fef3c7 50%, transparent 50%);
          padding: 0 0.25em;
        }

        /* Subscript/Superscript */
        .article-content sub,
        .article-content sup {
          font-size: 0.75em;
        }

        /* Selection */
        .article-content ::selection {
          background-color: #fde68a;
          color: #292929;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .article-content {
            font-size: 1.125rem;
          }

          .article-content p {
            font-size: 1.125rem;
            margin-bottom: 1.5rem;
          }

          .article-content > p:first-of-type::first-letter {
            font-size: 3rem;
          }

          .article-content h1 {
            font-size: 1.875rem;
          }

          .article-content h2 {
            font-size: 1.5rem;
          }

          .article-content h3 {
            font-size: 1.25rem;
          }

          .article-content blockquote {
            font-size: 1.125rem;
            margin: 2rem 0;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Video embeds */
        .article-content iframe,
        .article-content video {
          max-width: 100%;
          margin: 2.5rem auto;
          display: block;
          border-radius: 0.5rem;
        }

        /* Responsive video container */
        .article-content .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          margin: 2.5rem 0;
          border-radius: 0.5rem;
        }

        .article-content .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

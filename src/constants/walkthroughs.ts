export type Walkthrough = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
};

// Temporary walkthroughs. Replace these entries with the final hosted videos
// and supplied poster images once they are available.
export const WALKTHROUGHS: Walkthrough[] = [
  {
    id: "amor-overview",
    title: "Amor Project Overview",
    description:
      "Take a first look at the setting, architecture, and lifestyle at Amor.",
    videoUrl:
      "https://res.cloudinary.com/dtwlug9w9/video/upload/v1767467893/video_eb0r0t.mp4",
    thumbnail: "/images/optimized/DayView.webp",
  },
  {
    id: "amor-living",
    title: "A Day at Amor",
    description:
      "Explore the spaces designed for relaxed, modern family living.",
    videoUrl:
      "https://res.cloudinary.com/dtwlug9w9/video/upload/v1767467893/video_eb0r0t.mp4",
    thumbnail: "/images/optimized/ClubhouseNightView.webp",
  },
  {
    id: "amor-amenities",
    title: "Amenities Walkthrough",
    description:
      "Discover the amenities and outdoor spaces that complete the community.",
    videoUrl:
      "https://res.cloudinary.com/dtwlug9w9/video/upload/v1767467893/video_eb0r0t.mp4",
    thumbnail: "/images/optimized/BadmintonCourt.webp",
  },
];

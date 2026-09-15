export const NAV_LINKS = [
  {
    name: "About Us",
    link: "/about-us",
  },
  {
    name: "Projects",
    link: "/projects",
    dropdown: [] as { name: string; link: string }[],
  },
  {
    name: "Blogs",
    link: "/blogs",
  },
  {
    name: "Media",
    link: "#",
    dropdown: [
      {
        name: "Press Coverage",
        link: "/media/press-coverage",
      },
      {
        name: "Events and Campaign",
        link: "/media/events-and-campaigns",
      },
      {
        name: "Walkthrough",
        link: "/media/walkthrough",
      },
    ],
  },
];

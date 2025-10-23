export const SITE_CONFIG = {
  domain: "https://snap-notes.vercel.app",

  name: "SnapNotes",
  description:
    "SnapNotes is the ultimate note-taking application designed to help you capture, organize, and access your notes from anywhere. Whether you're a student, professional, or creative thinker, SnapNotes provides the tools you need to stay productive and inspired.",

  company: {
    name: "SnapNotes",
    email: "contact@snap-notes.vercel.app",
    phone: "+34 600 00 00 00",
    address: "Madrid, Spain",
  },

  social: {
    twitter: "@snapnotes",
    instagram: "https://www.instagram.com/snapnotes",
    linkedin: "https://www.linkedin.com/company/snapnotes",
    facebook: "https://www.facebook.com/snapnotes",
  },

  // Default SEO settings
  seo: {
    defaultTitle: "SnapNotes - The Ultimate Note-Taking App",
    titleTemplate: "%s | SnapNotes",
    defaultDescription:
      "SnapNotes is the ultimate note-taking application designed to help you capture, organize, and access your notes from anywhere. Whether you're a student, professional, or creative thinker, SnapNotes provides the tools you need to stay productive and inspired.",
    defaultImage: "/images/brand/logo.png",
    defaultImageAlt: "SnapNotes Logo",
  },
} as const;

// Utility functions
export const getSiteUrl = (path: string = "") => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_CONFIG.domain}${normalizedPath}`;
};

export const getCanonicalUrl = (pathname: string) => {
  return getSiteUrl(pathname);
};

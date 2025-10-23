export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: "✨",
    title: "Cloud Sync",
    description:
      "Your notes sync instantly across all your devices. Access them anywhere, anytime with real-time synchronization.",
  },
  {
    icon: "🔐",
    title: "End-to-End Encrypted",
    description:
      "Your notes are encrypted with AES-256. Only you can read what you write. We can't access your content.",
  },
  {
    icon: "🏷️",
    title: "Smart Organization",
    description:
      "Organize notes with tags, categories, and notebooks. Find exactly what you need in seconds.",
  },
  {
    icon: "🤝",
    title: "Team Collaboration",
    description:
      "Share notebooks with team members. Collaborate in real-time with comments and version history.",
  },
  {
    icon: "📎",
    title: "Rich Media Support",
    description:
      "Attach images, documents, audio files, and more to your notes. All your media in one place.",
  },
  {
    icon: "🔍",
    title: "Powerful Search",
    description:
      "Search across thousands of notes instantly. Filter by date, tags, or content type.",
  },
  {
    icon: "📱",
    title: "Offline Access",
    description:
      "Available on Pro plan. Work offline and your notes sync when you reconnect.",
  },
  {
    icon: "🌙",
    title: "Dark Mode",
    description:
      "Easy on the eyes. Switch between light and dark themes for comfortable note-taking.",
  },
];

# 📸 Snap Notes

A modern note-taking application that allows you to capture, organize, and manage your notes with ease. Built with React, TypeScript, and Vite for a fast and responsive experience.

![Snap Notes Landing Page](https://snap-notes.vercel.app/images/landing-page.webp)

## ✨ Features

- 📝 Create, edit, and delete notes
- 🎨 Rich text editing capabilities
- 💾 Local storage persistence
- 🎯 Clean and intuitive user interface
- ⚡ Fast performance with Vite
- 📱 Responsive design
- 🔍 Search and filter notes
- 🏷️ Organize with tags/categories

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- npm (comes with Node.js) or [pnpm](https://pnpm.io/) (recommended)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/snap-notes.git
cd snap-notes
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following Firebase configuration variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

> **Note:** These variables are prefixed with `NEXT_PUBLIC_` because they are exposed to the browser. To obtain these values, create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com) and retrieve the configuration from your project settings.

4. Start the development server:

```bash
pnpm dev
# or
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 🛠️ Built With

- **[React](https://reactjs.org/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework

## 📦 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally
- `pnpm lint` - Run ESLint for code quality

## 🏗️ Project Structure

```
snap-notes/
├── public/             # Static assets
├── src/
│   ├── app/            # Application core and routing
│   ├── assets/         # Images, icons, and static resources
│   ├── components/     # Reusable React components
│   ├── config/         # Configuration files and constants
│   ├── context/        # React Context providers and state management
│   ├── data/           # Data models and mock data
│   ├── lib/            # Utility functions and helpers
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions and interfaces
├── package.json        # Project dependencies
├── tsconfig.json       # TypeScript configuration
├── README.md           # This file
└── Config files        # Generated automatically by Nextjs

```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style

- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add comments for complex logic
- Ensure all lints pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Lucas del Villar**

- GitHub: [@ldelvillar](https://github.com/ldelvillar)

## 🙏 Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by modern note-taking applications

## 📧 Contact

If you have any questions or suggestions, feel free to open an issue or reach out!

---

⭐ Star this repository if you find it helpful!

# SnapNotes 📝

SnapNotes is a modern, lightweight note-taking application built with Next.js and Firebase, featuring a clean landing page built with Astro. It combines simplicity with functionality.

🌐 **[Visit SnapNotes](https://snap-notes.vercel.app)**

## 🌟 Features

### Notes Application
- **Quick Note Creation**: Create and edit notes instantly
- **Real-time Updates**: Changes are saved automatically to Firebase
- **Secure Authentication**: User authentication powered by Firebase
- **Responsive Design**: Works across all devices
- **Minimalist Interface**: Clean, distraction-free writing environment

### Landing Site
- **About Page**: Learn about SnapNotes' mission and features
- **FAQ Section**: Common questions answered
- **Contact Form**: Easy way to reach the team
- **Modern Design**: Built with Astro for optimal performance

## 🛠️ Technology Stack

- **Frontend (App)**
  - Next.js 15 (App Router)
  - React
  - Tailwind CSS
  - Firebase Client SDK

- **Landing Site**
  - Astro
  - Tailwind CSS

- **Backend**
  - Firebase
    - Authentication
    - Firestore Database

## 🚀 Getting Started

1. Clone the repository
```bash
git clone https://github.com/ldelvillar/snap-notes.git
cd snapnotes
```

2. Install dependencies
```bash
# Install app dependencies
cd notes-app
npm install

# Install landing site dependencies
cd ../landing
npm install
```

3. Set up environment variables
```bash
# In notes-app/.env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run the development servers
```bash
# Run the app (from notes-app directory)
npm run dev

# Run the landing site (from landing directory)
npm run dev
```

## 📁 Project Structure

```
snap-notes/
├── notes-app/                # Next.js application
│   ├── public/             # Static assets
│   │   ├── logo.svg      # SnapNotes logo
│   │   └── images/       # Static images
│   └── src/               # Source files
│       ├── app/          # Next.js app router structure
│       ├── components/   # React components
│       │   └── icons/   # Icon components
│       ├── config/      # Configuration files
│       ├── context/     # React context providers
│       ├── lib/         # Utility functions
│       ├── styles/      # Global styles
│       └── types/       # TypeScript types
│
└── landing/               # Astro landing site
    ├── src/
    │   ├── components/    # Astro components
    │   │   └── icons/    # Icon components
    │   ├── layouts/      # Page layouts
    │   ├── pages/        # Site pages
    │   └── sections/     # Site sections
    └── public/           # Static assets
        ├── logo.svg      # SnapNotes logo
        └── images/       # Static images
```

## 📋 Features in Detail

### Notes Application
- Create, read, update, and delete notes
- Real-time synchronization with Firebase
- Markdown support for rich text formatting
- User authentication and authorization
- Responsive design for mobile and desktop

### Landing Site
- Fast, static site built with Astro
- SEO-optimized content
- Contact form integration
- Responsive design
- Clear documentation and FAQ

## 🔐 Security

- Secure user authentication via Firebase
- Protected API routes
- Data validation and sanitization
- Secure data storage in Firestore

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any questions or feedback, please reach out through:
- Email: lucasvillarv@gmail.com
- GitHub Issues

---

Made with ❤️ by Lucas del Villar
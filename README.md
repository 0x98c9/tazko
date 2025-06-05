# Tazko - Simple Task Management System

Tazko is a modern, user-friendly task management web app for organizing, tracking, and managing your tasks, projects, and subjects. Built with Vite, React, TypeScript, shadcn-ui, and Tailwind CSS, Tazko offers a beautiful interface and powerful features to boost your productivity.

---

## 🚀 Features

- **Create Groups:** Organize tasks by subject or project.
- **Add & Edit Tasks:** Add tasks with details like description, tags, priority, due dates, and recurring schedules.
- **Drag & Drop:** Reorder tasks and groups easily.
- **Export/Import:** Save your tasks as JSON or TXT, or import from a file.
- **Statistics:** Visualize your progress and completion rates.
- **Search:** Quickly find tasks by title, description, or tags.
- **Responsive UI:** Works great on desktop and mobile.

---

## 🖥️ Demo

<!-- add an image -->
![Screenshot of Tazko](./public/assets/screenshot.png)

[Live](#)

---

## 📦 Tech Stack

- [Vite](https://vitejs.dev/) - Fast build tool
- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [shadcn-ui](https://ui.shadcn.com/) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Radix UI](https://www.radix-ui.com/) - Accessible UI primitives

---

## 📂 Folder Structure

```
├── public/           # Static assets (icons, manifest, og-image, etc.)
├── src/
│   ├── components/   # UI components (TaskBoard, TaskCard, Navbar, etc.)
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # State management, types, utilities
│   ├── pages/        # App pages (Index, NotFound)
│   └── ...           # Styles, entry points
├── package.json      # Project metadata & scripts
├── tailwind.config.ts
├── vite.config.ts
└── ...
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

```powershell
# Clone the repository
git clone https://github.com/0x98c9/tazko.git
cd tazko

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:8000` in your browser.

---

## 📖 How to Use

1. **Create a Group:** Click "Create New Group" and enter a name for your subject or project.
2. **Add Tasks:** Click the "+" button in a group to add tasks. Fill in details like title, description, and tags.
3. **Reorder:** Drag and drop tasks or groups to reorder them as you like.
4. **Export/Import:** Use the Export menu to save your tasks or import them from a file.
5. **Track Progress:** Mark tasks as complete and view your statistics at a glance.

---

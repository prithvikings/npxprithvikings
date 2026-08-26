# Prithvi — Terminal Portfolio

> An interactive developer portfolio that runs directly in your terminal.

A terminal-based portfolio built with **TypeScript, React, and Ink**.

Instead of a traditional web portfolio, this project provides a keyboard-driven CLI experience for exploring my profile, experience, projects, skills, and contact information.

## ✨ Features

* 🖥️ Interactive terminal UI
* ⌨️ Keyboard navigation with arrow keys
* 📂 Collapsible sections
* 🚀 Project browsing with detailed project views
* 🔗 Open GitHub, LinkedIn, and website directly from the terminal
* 🎨 Terminal theme support
* 📱 Responsive terminal layout
* 🧭 Direct CLI commands for specific sections
* ❓ Built-in help and version commands
* 📦 Distributed as an npm package

## 🛠️ Tech Stack

* **TypeScript**
* **React**
* **Ink**
* **Node.js**
* **Figlet**

## 🚀 Run It

You don't need to clone the repository.

Run the portfolio directly with:

```bash
npx prithvikings
```

You can also open specific sections directly:

```bash
npx prithvikings about
npx prithvikings experience
npx prithvikings projects
```

Open my links directly:

```bash
npx prithvikings github
npx prithvikings linkedin
```

View available commands:

```bash
npx prithvikings --help
```

Check the installed version:

```bash
npx prithvikings --version
```

## 🎮 Controls

| Key       | Action                                     |
| --------- | ------------------------------------------ |
| `↑` / `↓` | Navigate                                   |
| `Enter`   | Select                                     |
| `Esc`     | Go back                                    |
| `Q`       | Quit                                       |
| `←` / `→` | Navigate available controls                |
| `Enter`   | Expand / collapse sections where supported |

## 📁 Project Structure

```text
src/
├── components/
│   ├── CollapsibleSection.tsx
│   ├── ExternalLink.tsx
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── PageFooter.tsx
│   ├── PageRenderer.tsx
│   ├── ProjectDetails.tsx
│   ├── ProjectList.tsx
│   ├── ScrollPageLayout.tsx
│   ├── ScrollViewport.tsx
│   ├── StatusBar.tsx
│   ├── TerminalLayout.tsx
│   ├── TerminalLink.tsx
│   └── ThemeToggle.tsx
│
├── data/
│   ├── contact.ts
│   ├── contactLinks.ts
│   ├── experience.ts
│   ├── navigation.ts
│   ├── profile.ts
│   ├── projects.ts
│   └── skills.ts
│
├── hooks/
│   ├── usePortfolioInput.ts
│   └── useTerminalSize.ts
│
├── pages/
│   ├── About.tsx
│   ├── Contact.tsx
│   ├── Experience.tsx
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── Resume.tsx
│   ├── Skills.tsx
│   └── Welcome.tsx
│
├── utils/
│   └── openUrl.ts
│
├── App.tsx
├── index.tsx
└── theme.ts
```

## 🧑‍💻 Development

Clone the repository:

```bash
git clone https://github.com/prithvikings/npxprithvikings.git
```

Move into the project:

```bash
cd npxprithvikings
```

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Run the CLI:

```bash
npm start
```

Or build and run in one command:

```bash
npm run dev
```

## 📦 Publishing

The project is distributed through npm as:

```text
prithvikings
```

Create a package locally:

```bash
npm pack
```

Test the package:

```bash
npm install -g ./prithvikings-1.0.0.tgz
```

Then run:

```bash
prithvi
```

## 🗂️ Version

Current version:

```text
v1.0.0
```

## 🔗 Links

* **Portfolio:** https://prithvikings.me/
* **GitHub:** https://github.com/prithvikings
* **LinkedIn:** https://www.linkedin.com/in/prithvi312/

## 👨‍💻 About Me

I'm **Prithvi Raj**, a Full Stack Developer interested in building scalable web applications, developer tools, and AI-powered products.

I enjoy building products from scratch, experimenting with new technologies, and solving engineering problems.

## 📄 License

This project is licensed under the **MIT License**.

#!/usr/bin/env node

import { render } from "ink";

import App from "./App.js";
import type { View } from "./hooks/usePortfolioInput.js";
import { contact } from "./data/contact.js";
import { openUrl } from "./utils/openUrl.js";

const args = process.argv.slice(2);
const command = args[0];

const commands: Record<string, View> = {
  about: "about",
  experience: "experience",
  projects: "project-list",
  contact: "contact",
};

function showHelp() {
  console.log(`
PRITHVI — Terminal Portfolio

Usage:
  npx prithvi              Open interactive portfolio

Sections:
  npx prithvi about        Open about section
  npx prithvi experience   Open experience section
  npx prithvi projects     Browse projects
  npx prithvi contact      Open contact section

Links:
  npx prithvi github       Open GitHub
  npx prithvi linkedin     Open LinkedIn
  npx prithvi website      Open portfolio website

Options:
  -h, --help               Show this help
  -v, --version            Show version
`);
}

if (
  command === "--help" ||
  command === "-h"
) {
  showHelp();
  process.exit(0);
}

if (
  command === "--version" ||
  command === "-v"
) {
  console.log("PRITHVI Terminal Portfolio v1.0.0");
  process.exit(0);
}

if (command === "github") {
  openUrl(contact.github);
  process.exit(0);
}

if (command === "linkedin") {
  openUrl(contact.linkedin);
  process.exit(0);
}

if (command === "website") {
  openUrl(contact.website);
  process.exit(0);
}

if (command && !commands[command]) {
  console.error(
    `Unknown command: ${command}`
  );

  console.error(
    "Run `npx prithvi --help` for available commands."
  );

  process.exit(1);
}

const initialView =
  command
    ? commands[command]
    : "home";

// Keep npm/node startup output from becoming part of the portfolio UI.
// The interactive experience should begin on a clean terminal screen.
console.clear();

render(
  <App initialView={initialView} />
);
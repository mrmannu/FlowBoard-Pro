# FlowBoard — Project Workspace
## 🚀 Live Demo

[View FlowBoard Pro](https://flow-board-pro.vercel.app/)

## 🛠️ Tech Stack
- React.js
- Tailwind CSS
- Vite

A responsive project-management dashboard built with React, Vite, and Tailwind CSS v4. Designed as a portfolio project to demonstrate component composition, state management, filtering, forms, local persistence, and responsive UI.

## Features

- Responsive sidebar and mobile navigation
- Project progress cards and weekly activity visualization
- Create tasks with project, priority, and due date
- Search tasks and filter by status
- Click a status/check icon to cycle through task states
- Delete tasks
- Tasks persist in `localStorage` after refresh
- Empty states, toast feedback, and accessible form labels
- Lucide icons and polished dashboard styling

## Tech stack

- React 18
- Vite 6
- Tailwind CSS v4
- Lucide React

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed in your terminal.

## Production build

```bash
npm run build
npm run preview
```

## Notes

This is a frontend-only demo. Task data is stored in the browser using `localStorage`; there is no authentication or remote database. Replace demo metrics and profile data before presenting it as a real product.

## GitHub repository description

FlowBoard is a responsive project-management dashboard built with React, Tailwind CSS v4, and Vite. Includes task creation, status updates, search, filters, project progress, responsive navigation, and localStorage persistence.

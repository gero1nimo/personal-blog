# Personal Portfolio & Blog Frontend

A modern, responsive personal portfolio and blog website built with React.js and Tailwind CSS, connected to a FastAPI backend.

## Tech Stack

- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **API Communication:** Axios
- **Backend:** FastAPI (RESTful API)

## Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── assets/                 # Images, icons, etc.
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Responsive navigation bar
│   │   ├── Footer.jsx          # Site footer with social links
│   │   ├── Hero.jsx            # Landing page hero section
│   │   ├── ProjectCard.jsx     # Project display card component
│   │   ├── BlogCard.jsx        # Blog post card component
│   │   └── SkillsSection.jsx   # Skills/technologies display
│   ├── pages/                  # Page components
│   │   ├── Home.jsx            # Home page (Hero, Skills, Featured Projects)
│   │   ├── About.jsx           # About page (Bio, Education, Experience)
│   │   ├── Portfolio.jsx       # Portfolio page (Projects grid with filters)
│   │   └── Blog.jsx            # Blog page (Posts with search/tags)
│   ├── services/               # API services
│   │   └── api.js              # Axios instance & API endpoints
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # App-specific styles
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles & Tailwind imports
├── index.html                  # HTML template
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
└── README.md                   # This file
```

## Pages Overview

### Home (`/`)
- **Hero Section:** Introduction with CTA buttons
- **Skills Section:** Technology stack organized by category
- **Featured Projects:** Highlighted projects carousel/grid
- **CTA Section:** Contact invitation

### About (`/about`)
- **Profile Section:** Photo and bio
- **Education:** Academic background
- **Experience:** Work history timeline
- **Technologies:** Comprehensive tech stack list

### Portfolio (`/portfolio`)
- **Projects Grid:** All projects displayed in cards
- **Search:** Filter projects by name, description, or tech
- **Status Filter:** Filter by project status (Completed, In Progress)
- **Project Details:** Links to live demo and GitHub

### Blog (`/blog`)
- **Posts Grid:** Blog articles displayed in cards
- **Search:** Search articles by title or content
- **Tag Filter:** Filter posts by tags
- **Newsletter:** Email subscription form

## Components

### Navbar
Responsive navigation with mobile hamburger menu. Sticky positioning for easy navigation.

### Footer
Site-wide footer with quick links, contact info, and social media links.

### Hero
Eye-catching hero section with animated background, stats, and call-to-action buttons.

### ProjectCard
Displays project information including:
- Project name and status badge
- Description (truncated)
- Tech stack tags
- Links to live demo and GitHub

### BlogCard
Displays blog post with:
- Title and excerpt
- Tags
- View count
- Read more link

### SkillsSection
Grid display of skills organized by category (Frontend, Backend, Database, Tools & Cloud).

## API Integration

The `src/services/api.js` file provides:

```javascript
// Base configuration
const API_BASE_URL = 'http://localhost:8000';

// Projects API
projectsApi.getAll()      // GET /projects/
projectsApi.getById(id)   // GET /projects/{id}
projectsApi.create(data)  // POST /projects/

// Blog API
blogApi.getAll()          // GET /blogposts/
blogApi.getById(id)       // GET /blogposts/{id}
blogApi.create(data)      // POST /blogposts/
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Configuration

### Tailwind CSS
Tailwind is configured via the Vite plugin in `vite.config.js`. Customizations can be added by extending the default theme.

### API Base URL
Update `API_BASE_URL` in `src/services/api.js` to point to your backend:

```javascript
const API_BASE_URL = 'http://localhost:8000'; // Development
// const API_BASE_URL = 'https://api.yourdomain.com'; // Production
```

## Customization

### Personal Information
Update the following files with your information:
- `src/components/Hero.jsx` - Name, title, stats
- `src/components/Footer.jsx` - Email, location, social links
- `src/pages/About.jsx` - Bio, education, experience

### Styling
- Colors: Tailwind's indigo/purple theme is used throughout
- Modify component classes to change the color scheme
- Global styles in `src/index.css`

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License
MIT License

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
- **Article Detail:** Full post view at `/blog/:slug`

## Components

### Navbar
Responsive navigation with mobile hamburger menu. Sticky positioning for easy navigation.

### Footer
Site-wide footer with quick links, contact info, and social media links.

### Hero
Eye-catching hero section with animated background, stats, and call-to-action buttons.

### FeaturedProjectBanner
Shows the first `featured` project from the API on the home page (hidden if none).

### ContactSection
Contact form that posts to `POST /contact/`, including a hidden honeypot field.

### SkillsSection
Grid display of skills organized by category (Frontend, Backend, Database, Tools & Cloud).

## API Integration

The `src/services/api.js` file wraps the backend `/api/v1` contract (camelCase JSON, paginated lists, Bearer token):

```javascript
// Base URL comes from VITE_API_URL (see .env.example),
// defaulting to http://localhost:8000/api/v1

// Public
projectsApi.getAll({ page, size })   // GET /projects/
projectsApi.getBySlug(slug)          // GET /projects/slug/{slug}
blogApi.getAll({ page, size, tag })  // GET /blogs/
blogApi.getBySlug(slug)              // GET /blogs/slug/{slug}
contactApi.send(data)                // POST /contact/

// Auth + admin (Bearer)
authApi.login(email, password)       // POST /auth/login (form-urlencoded)
authApi.me()                         // GET /auth/me
adminProjectsApi / adminBlogApi      // GET/POST/PUT/PATCH/DELETE /admin/...
adminContactApi                      // list / markRead / remove on /admin/contact
mediaApi.upload(file)                // ImageKit signed upload
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
Set the backend URL via the `VITE_API_URL` environment variable. Copy `.env.example` to `.env`:

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

If unset, it defaults to `http://localhost:8000/api/v1`.

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
